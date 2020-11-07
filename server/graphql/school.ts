/* eslint-disable no-unused-vars */
import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  InputType,
  Field,
  Int,
  Query,
  FieldResolver,
  Root,
  Authorized,
  ResolverInterface,
  Float,
} from "type-graphql";
import { RemoveResult, ObjectIdScalar } from "./types";
import {
  Context,
  UserInputError,
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from "apollo-server-core";
import { School } from "../models/schoolSchema";
import { CContext } from "../types";
import { Length } from "class-validator";
import { Container } from "typedi";
import { SchoolService } from "./../services/school";
import { SchoolGServie } from "./../services/schoolG";
import { StudentService } from "./../services/student";
import { Role } from "../models/person";
import { AddressLocation } from "./../models/address";
import { AddressLocationService } from "./../services/addressLocation";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";

@InputType()
class CreateSchoolInput implements Partial<School> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: ObjectId;

  @Length(2, 255)
  @Field()
  name: string;

  @Length(4, 10)
  @Field({ nullable: true })
  eOkulCode?: string;

  @Field(() => ObjectIdScalar, { nullable: true })
  schoolKindId?: ObjectId;
}
@InputType()
class AddAddressSchoolInput {
  @Field(() => ObjectIdScalar)
  schoolId: string;

  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lng: number;
}

@Resolver(() => School)
export class SchoolFieldResolver implements ResolverInterface<School> {
  constructor(
    private readonly schoolService: SchoolGServie,
    private readonly studentService: StudentService
  ) {
    this.schoolService = Container.get(SchoolGServie);
    this.studentService = Container.get(StudentService);
  }

  @FieldResolver(() => Int)
  async studentCount(@Root() school: School, @Ctx() ctx: Context<CContext>) {
    return await this.studentService.getCountBySchoolId(school._id);
  }
  @FieldResolver()
  async schoolKindName(@Root() school: School, @Ctx() ctx: Context<CContext>) {
    const { activeUser } = ctx;
    if (!activeUser) throw new ApolloError("");
    if (!school.schoolKindId) return "";
    const schoolG = await this.schoolService.getById(school.schoolKindId);
    if (schoolG) return schoolG.name;
    return "";
  }
}

@Resolver()
export class SchoolResolver {
  constructor(
    private readonly schoolService: SchoolService,
    private readonly addressLocationService: AddressLocationService
  ) {
    this.schoolService = Container.get<SchoolService>(SchoolService);
    this.addressLocationService = Container.get(AddressLocationService);
  }

  @Authorized(Role.OWNER, Role.ADMIN, Role.TEACHER, Role.DRIVER)
  @Query(() => [School])
  async schools(
    @Ctx() ctx: Context<CContext>,
    @Arg("institutionId", () => ObjectIdScalar, { nullable: true })
    institutionId?: ObjectId
  ): Promise<School[]> {
    const { activeUser } = ctx;
    if (!activeUser || (!activeUser.teacher?.institutionId && !institutionId))
      throw new AuthenticationError("");
    if (activeUser?.roles.includes(Role.DRIVER) && !institutionId)
      throw new ForbiddenError("");
    if (!activeUser) throw new AuthenticationError("");
    return await this.schoolService.getManyByInstId(
      activeUser.teacher?.institutionId
        ? new ObjectId(activeUser.teacher.institutionId)
        : (institutionId as ObjectId)
    );
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Query(() => School)
  async school(
    @Ctx() ctx: Context<CContext>,
    @Arg("id", () => ObjectIdScalar, { nullable: true }) id?: ObjectId,
    @Arg("eOkul", { nullable: true }) eOkul?: string
  ): Promise<School> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    if (!id && !eOkul) throw new UserInputError("id or eOkul is required");
    if (!activeUser) throw new AuthenticationError("");
    if (id) {
      const school = await this.schoolService.getById(
        new ObjectId(activeUser.teacher.institutionId),
        id
      );
      if (school) return school;
    } else if (eOkul) {
      const school = await this.schoolService.getByEOkulCode(
        new ObjectId(activeUser.teacher.institutionId),
        eOkul
      );
      if (school) return school;
    }
    throw new ApolloError("School didn't find");
  }

  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => School)
  async createSchool(
    @Arg("data") data: CreateSchoolInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<School> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    if (!activeUser) throw new AuthenticationError("");
    const { _id, ...schoolData } = data;
    let school;
    if (_id) {
      school = await this.schoolService.update(
        _id,
        schoolData,
        new ObjectId(activeUser.teacher.institutionId)
      );
    } else {
      school = await this.schoolService.create(
        schoolData,
        new ObjectId(activeUser.teacher.institutionId)
      );
    }
    if (school) return school;
    throw new ApolloError("");
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => RemoveResult)
  async deleteSchool(
    @Arg("schoolId", () => ObjectIdScalar) schoolId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<RemoveResult> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const result = await this.schoolService.remove(
      new ObjectId(activeUser.teacher.institutionId),
      schoolId
    );
    return {
      code: "200",
      success: result,
      _id: result ? schoolId.toHexString() : "",
    };
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => AddressLocation)
  async addAddressToSchool(
    @Arg("data", () => AddAddressSchoolInput) data: AddAddressSchoolInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<AddressLocation> {
    const { lat, lng, schoolId } = data;
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const address = await this.schoolService.addAddress(
      this.addressLocationService.create(lat, lng),
      Types.ObjectId(activeUser.teacher.institutionId),
      Types.ObjectId(schoolId)
    );
    if (address) return address;
    throw new ApolloError("");
  }
}
