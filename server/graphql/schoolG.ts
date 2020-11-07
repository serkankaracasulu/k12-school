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
  Authorized,
} from "type-graphql";
import { Context } from "apollo-server-core";
import { ClassG, SchoolG } from "../models/schoolGModel";
import { ClassLesson } from "./../models/schoolGModel";
import { CContext } from "../types";
import { Length, IsInt } from "class-validator";
import { SchoolGServie } from "./../services/schoolG";
import { Container } from "typedi";
import { AuthenticationError } from "apollo-server-core";
import { Role } from "../models/person";
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "./types";
import { ApolloError } from "apollo-server";

@InputType()
class ClassesGInput implements Partial<ClassG> {
  _id: ObjectId;
  lessons: ClassLesson[];

  @IsInt()
  @Field(() => Int)
  level: number;
}

@InputType()
class SchoolGInput implements Partial<SchoolG> {
  @Length(2, 255)
  @Field()
  name: string;

  @Field(() => [ClassesGInput])
  classes: ClassesGInput[];
}

Resolver();
export class SchoolGResolver {
  constructor(private readonly schoolGServie: SchoolGServie) {
    this.schoolGServie = Container.get(SchoolGServie);
  }
  @Authorized(Role.SUPER_ADMIN, Role.ADMIN, Role.OWNER)
  @Query(() => [SchoolG])
  async schoolsG(@Ctx() ctx: Context<CContext>): Promise<SchoolG[]> {
    return await this.schoolGServie.getAll();
  }
  @Authorized(Role.SUPER_ADMIN, Role.ADMIN, Role.OWNER)
  @Query(() => SchoolG)
  async schoolG(
    @Ctx() ctx: Context<CContext>,
    @Arg("id", () => ObjectIdScalar) id: ObjectId
  ): Promise<SchoolG> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const school = await this.schoolGServie.getById(id);
    if (school) return school;
    throw new ApolloError("School didn't find");
  }
  @Authorized(Role.SUPER_ADMIN)
  @Mutation(() => SchoolG)
  async createSchoolG(@Arg("data") data: SchoolGInput): Promise<SchoolG> {
    try {
      return await this.schoolGServie.create(data);
    } catch (error) {
      throw error;
    }
  }
}
