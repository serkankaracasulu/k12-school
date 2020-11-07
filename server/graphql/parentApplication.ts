import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  Authorized,
  Query,
  ResolverInterface,
  FieldResolver,
  Root,
} from "type-graphql";
import { ObjectIdScalar } from "./types";
import { Context, AuthenticationError } from "apollo-server-core";
import { CContext, CreateType } from "../types";
import { Container } from "typedi";
import { UserService } from "./../services/user";
import { Role } from "../models/person";
import { ObjectId } from "mongodb";
import { ParentApplication } from "./../models/parentApplication";
import { ParentApplicationService } from "./../services/parentApplication";
import { StudentService } from "./../services/student";
import { ForbiddenError } from "apollo-server";

Resolver();
export class ParentApplicationResolver {
  constructor(
    private readonly parentApplicationService: ParentApplicationService,
    private readonly userService: UserService,
    private readonly studentService: StudentService
  ) {
    this.userService = Container.get(UserService);
    this.studentService = Container.get(StudentService);
    this.parentApplicationService = Container.get(ParentApplicationService);
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => ParentApplication)
  async invitationParent(
    @Arg("email", () => String) email: string,
    @Arg("studentId", () => ObjectIdScalar) studentId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<ParentApplication> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const user = await this.userService.getByEmail(email);
    const parentApplication: CreateType<ParentApplication> = {
      email: email,
      status: user ? 1 : 0,
      institutionId: new ObjectId(activeUser.teacher.institutionId),
      studentId,
    };
    if (user) parentApplication.userId = user._id;
    try {
      const applications = await this.parentApplicationService.create(
        parentApplication
      );
      applications.sendInvatation();
      return applications.toObject({ virtuals: true });
    } catch (error) {}
    throw new Error("");
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Query(() => [ParentApplication])
  async parentApplications(
    @Arg("studentId", () => ObjectIdScalar) studentId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<ParentApplication[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const student = await this.studentService.getStudentById(studentId);
    if (
      !student ||
      !student.institutionId.equals(activeUser.teacher.institutionId)
    )
      throw new ForbiddenError("");
    return await this.parentApplicationService.getManyByStudentId(studentId);
  }
  @Authorized(Role.USER)
  @Query(() => [ParentApplication])
  async myParentApplications(
    @Ctx() ctx: Context<CContext>
  ): Promise<ParentApplication[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return await this.parentApplicationService.getManyByUserId(
      new ObjectId(activeUser._id)
    );
  }
}
