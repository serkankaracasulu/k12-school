import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  Authorized,
  Query,
  ResolverInterface,
  Root,
  FieldResolver,
} from "type-graphql";
import { ObjectIdScalar, RemoveResult, VoyageTimeInput, Result } from "./types";
import { Context, AuthenticationError } from "apollo-server-core";
import { CContext } from "../types";
import { Container } from "typedi";
import { Role } from "../models/person";
import { ObjectId } from "mongodb";
import { VoyageService } from "./../services/voyage";
import {
  VoyageTime,
  StudentVoyegeInfo,
  IStudentVoyegeInfo,
  StudentVoyegeEnum,
} from "./../models/voyage";
import { ApolloError } from "apollo-server";
import { StudentService } from "./../services/student";
import { Student } from "./../models/student";

@Resolver(() => StudentVoyegeInfo)
export class StudentVoyageInfoResolver
  implements ResolverInterface<StudentVoyegeInfo> {
  constructor(private readonly studentService: StudentService) {
    this.studentService = Container.get(StudentService);
  }
  @FieldResolver(() => Student)
  async student(@Root() voyage: IStudentVoyegeInfo | StudentVoyegeInfo) {
    return await this.studentService.getStudentById(voyage.studentId);
  }
}

@Resolver()
export class VoyageTimeResolver {
  constructor(private readonly voyageService: VoyageService) {
    this.voyageService = Container.get(VoyageService);
  }
  @Authorized(Role.DRIVER)
  @Mutation(() => RemoveResult)
  async removeVoyageTime(
    @Ctx() ctx: Context<CContext>,
    @Arg("voyageId", () => ObjectIdScalar) voyageId: ObjectId,
    @Arg("timeId", () => ObjectIdScalar) timeId: ObjectId
  ): Promise<RemoveResult> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const result = await this.voyageService.removeVoyageTime(voyageId, timeId);
    return { success: result, code: "200", _id: timeId.toHexString() };
  }

  @Authorized(Role.DRIVER)
  @Mutation(() => VoyageTime)
  async addVoyageTime(
    @Ctx() ctx: Context<CContext>,
    @Arg("voyageId", () => ObjectIdScalar) voyageId: ObjectId,
    @Arg("data", () => VoyageTimeInput) data: VoyageTimeInput
  ): Promise<VoyageTime> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    var voyage = await this.voyageService.getById(voyageId);
    if (!voyage) throw new ApolloError("Voyage didn't find");
    const studentInfos: StudentVoyegeInfo[] = [];
    voyage.studentIds.forEach((id) => {
      studentInfos.push({
        status: StudentVoyegeEnum.gotOff,
        order: 0,
        disabled: false,
        studentId: id,
        _id: new ObjectId(),
      });
    });
    const voyageTime: VoyageTime = {
      ...data,
      _id: new ObjectId(),
      studentInfos,
    };
    const time = await this.voyageService.addVoyageTime(voyageId, voyageTime);
    if (time) return time;
    throw new ApolloError("Failed");
  }
  @Authorized(Role.DRIVER)
  @Query(() => VoyageTime)
  async voyageTime(
    @Arg("voyageId", () => ObjectIdScalar) voyageId: ObjectId,
    @Arg("voyageTimeId", () => ObjectIdScalar) voyageTimeId: ObjectId
  ): Promise<VoyageTime> {
    const voyageTime = await this.voyageService.getVoyageTime(
      voyageId,
      voyageTimeId
    );
    if (!voyageTime) throw new ApolloError("Voyage time didn't find");
    return voyageTime;
  }
  @Authorized(Role.DRIVER)
  @Mutation(() => Result)
  async setVoyageOrderLast(
    @Arg("voyageId", () => ObjectIdScalar) voyageId: ObjectId,
    @Arg("studentId", () => ObjectIdScalar) studentId: ObjectId
  ): Promise<Result> {
    const result = await this.voyageService.setStudentLast(voyageId, studentId);
    return { success: result };
  }
  @Authorized(Role.DRIVER)
  @Mutation(() => VoyageTime)
  async activeVoyageTime(
    @Ctx() ctx: Context<CContext>,
    @Arg("parentStudentId", () => ObjectIdScalar)
    parentStudentId: ObjectId
  ): Promise<any> {
    const { activeUser, requestParent } = ctx;
    if (!activeUser || !requestParent) throw new AuthenticationError("");
    const result = await this.voyageService.getById;
  }
}
