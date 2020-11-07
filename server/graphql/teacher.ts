/* eslint-disable no-unused-vars */

import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  ID,
  Query,
  ResolverInterface,
  FieldResolver,
  Root,
  Authorized,
} from "type-graphql";
import { RemoveResult, ObjectIdScalar } from "./types";
import { Context, ApolloError, AuthenticationError } from "apollo-server-core";
import { User } from "../models/user";
import { CContext } from "../types";
import { PersonService } from "./../services/person";
import { Container } from "typedi";
import { TeacherService } from "./../services/teacher";
import { TeacherApplicationService } from "./../services/teacherApplication";
import { UserService } from "./../services/user";
import { ObjectId } from "mongodb";
import { Role } from "../models/person";
import { ForbiddenError } from "apollo-server";
import { ParentApplicationService } from "./../services/parentApplication";

/*
@Resolver(() => Teacher)
export class TeacherResolverField implements ResolverInterface<Teacher> {
  constructor(private readonly personService: PersonService) {
    this.personService = Container.get(PersonService);
  }
  @FieldResolver()
  async user(
    @Root() teacher: ITeacher | Teacher,
    @Ctx() ctx: Context<CContext>
  ): Promise<User | undefined> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const user = await this.personService.getById(teacher.userId);
    if (user) return user.toJSON({ virtuals: true });
  }
}
*/
@Resolver()
export class TeacherResolver {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly teacherApplicationService: TeacherApplicationService,
    private readonly userService: UserService
  ) {
    this.teacherService = Container.get(TeacherService);

    this.userService = Container.get(UserService);
    this.teacherApplicationService = Container.get(TeacherApplicationService);
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Query(() => [User])
  async teachers(@Ctx() ctx: Context<CContext>): Promise<User[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    return await this.teacherService.getTeachersById(
      new ObjectId(activeUser.teacher.institutionId)
    );
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => User)
  async addTeacher(
    @Arg("applicationId", () => ObjectIdScalar) applicationId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<User> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const application = await this.teacherApplicationService.getById(
      new ObjectId(activeUser.teacher.institutionId),
      applicationId
    );
    if (!application || !application.userId)
      throw new ApolloError("Application didn't find.");
    if (application.status != 2) throw new ForbiddenError("");
    const teacher = await this.teacherService.create(
      new ObjectId(activeUser.teacher.institutionId),
      application.userId,
      new ObjectId(activeUser._id)
    );
    if (!teacher) throw new ApolloError("User didn't find");
    await this.teacherApplicationService.remove(
      new ObjectId(activeUser.teacher.institutionId),
      applicationId
    );
    if (teacher) return teacher;
    throw new ApolloError("");
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => RemoveResult)
  async dismissTeacher(
    @Arg("teacherId", () => ObjectIdScalar) teacherId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<RemoveResult> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const result = await this.teacherService.remove(
      new ObjectId(activeUser.teacher.institutionId),
      teacherId
    );
    return { code: "200", success: result, _id: teacherId.toHexString() };
  }
}
