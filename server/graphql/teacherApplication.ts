/* eslint-disable no-unused-vars */

import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  Query,
  FieldResolver,
  Root,
  Authorized,
  Subscription,
  ResolverFilterData,
  Publisher,
  PubSub,
} from "type-graphql";
import { Result, ObjectIdScalar } from "./types";
import {
  Context,
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} from "apollo-server-core";
import {
  TeacherApplication,
  ITeacherApplication,
} from "./../models/teacherApplication";
import { CContext, Topic } from "../types";
import { InstitutionService } from "./../services/institution";
import { Container } from "typedi";
import { UserService } from "./../services/user";
import { TeacherApplicationService } from "./../services/teacherApplication";
import { Application, IApplication } from "./../models/application";
import { Role } from "../models/person";
import { ObjectId } from "mongodb";
import { StudentService } from "../services/student";

@Resolver(() => Application)
export class ApplicationFieldResolver {
  /**
   *
   */
  constructor(
    private readonly institutionService: InstitutionService,
    private readonly userService: UserService,
    private readonly studentService: StudentService
  ) {
    this.institutionService = Container.get(InstitutionService);
    this.userService = Container.get(UserService);
    this.studentService = Container.get(StudentService);
  }

  @FieldResolver(() => String)
  async institutionName(
    @Root() application: IApplication | Application,
    @Ctx() ctx: Context<CContext>
  ): Promise<string> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const inst = await this.institutionService.getById(
      application.institutionId
    );
    if (inst) return inst.name;
    return "";
  }
  @FieldResolver(() => String)
  async userFullName(
    @Root() application: IApplication | Application,
    @Ctx() ctx: Context<CContext>
  ): Promise<string> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    if (!application.userId) return "";
    const user = await this.userService.getById(application.userId);
    if (user && typeof user.fullName === "string") return user.fullName;
    return "";
  }
  @FieldResolver(() => String)
  async studentFullName(
    @Root() parentApplication: IApplication | Application,
    @Ctx() ctx: Context<CContext>
  ) {
    if (!parentApplication.studentId) return "";

    const student = await this.studentService.getById(
      parentApplication.studentId
    );
    return student?.fullName;
  }
}

Resolver();
export class TeacherApplicationResolver {
  constructor(
    private readonly teacherApplicationService: TeacherApplicationService,
    private readonly userService: UserService
  ) {
    this.userService = Container.get(UserService);
    this.teacherApplicationService = Container.get(TeacherApplicationService);
  }

  @Authorized(Role.USER)
  @Query(() => [TeacherApplication])
  async jobRequests(
    @Ctx() ctx: Context<CContext>
  ): Promise<TeacherApplication[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    if (activeUser.teacher?.institutionId) throw new ForbiddenError("");
    return await this.teacherApplicationService.getManyByUserId(
      new ObjectId(activeUser._id)
    );
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Query(() => [TeacherApplication])
  async teacherApplications(
    @Ctx() ctx: Context<CContext>
  ): Promise<TeacherApplication[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    return await this.teacherApplicationService.getAllOfInst(
      new ObjectId(activeUser.teacher.institutionId)
    );
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => TeacherApplication)
  async deleteInvitation(
    @Arg("applicationId", () => ObjectIdScalar) applicationId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<TeacherApplication> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const application = await this.teacherApplicationService.remove(
      new ObjectId(activeUser.teacher.institutionId),
      applicationId
    );
    if (application) return application;
    throw new ApolloError("Application didn't find");
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => Result)
  async reSendInvitation(
    @Arg("applicationId", () => ObjectIdScalar) applicationId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<Result> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const application = await this.teacherApplicationService.getById(
      new ObjectId(activeUser.teacher.institutionId),
      applicationId
    );
    if (application) {
      try {
        await application.sendInvatation();
      } catch (error) {
        console.log(error);
        return { success: false };
      }
      return { success: true };
    }
    throw new ApolloError("Application didn't find");
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => [TeacherApplication])
  async invitationTeachers(
    @Arg("emails", () => [String]) emails: string[],
    @Ctx() ctx: Context<CContext>
  ): Promise<TeacherApplication[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const teacherApplications: Omit<
      TeacherApplication,
      "createdAt" | "_id"
    >[] = [];
    const users = await this.userService.getManyByEmail(emails);
    const emailList = new Set(emails);
    for (const user of users) {
      if (user.email) emailList.delete(user.email);
      if (!user.teacher?.institutionId) {
        teacherApplications.push({
          email: user.email,
          userId: user._id,
          status: 1,
          institutionId: new ObjectId(activeUser.teacher.institutionId),
        });
      }
    }
    for (const email of emailList.values()) {
      teacherApplications.push({
        email: email,
        status: 0,
        institutionId: new ObjectId(activeUser.teacher.institutionId),
      });
    }

    const promises: Promise<void>[] = [];
    try {
      const applications = await this.teacherApplicationService.createMany(
        teacherApplications
      );
      applications.forEach((a) => promises.push(a.sendInvatation()));
      await Promise.all(promises);
      return applications;
    } catch (error) {
      throw error;
    }
  }
  @Authorized()
  @Mutation(() => Application)
  async acceptInvitation(
    @Arg("invitationId", () => ObjectIdScalar) invitationId: ObjectId,
    @Ctx() ctx: Context<CContext>,
    @PubSub(Topic.applicaitonUpdated)
    publish: Publisher<Application>,
    @Arg("d", { nullable: true }) d?: boolean,
    @Arg("r", { nullable: true }) r?: boolean
  ): Promise<Application> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    let app = null;
    if (d)
      app = await this.teacherApplicationService.removeMine(
        invitationId,
        new ObjectId(activeUser._id)
      );
    else {
      app = await this.teacherApplicationService.updateStatusByUserId(
        invitationId,
        new ObjectId(activeUser._id),
        r ? 1 : 2
      );
      app && publish(app.toObject());
    }
    if (app) return app;
    throw new ApolloError("Application didn't find");
  }
  @Authorized(Role.USER, Role.OWNER, Role.ADMIN)
  @Subscription({
    topics: Topic.applicaitonUpdated,
    filter: ({
      payload,
      context,
    }: ResolverFilterData<Application, void, CContext>) => {
      if (!context.activeUser) return false;
      return (
        (payload.userId !== undefined &&
          payload.userId.toHexString() === context.activeUser._id) ||
        (context.activeUser.roles != undefined &&
          context.activeUser.teacher?.institutionId !== undefined &&
          payload.institutionId.toHexString() ===
            context.activeUser.teacher.institutionId &&
          context.activeUser.roles.some(
            (r) => r === Role.OWNER || r === Role.ADMIN
          ))
      );
    },
  })
  applicationUpdated(@Root() applicationPayload: Application): Application {
    return applicationPayload;
  }
}
