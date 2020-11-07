import {
  Resolver,
  Mutation,
  Arg,
  Authorized,
  Ctx,
  InputType,
  Field,
  Query,
  FieldResolver,
  Root,
  Publisher,
  PubSub,
} from "type-graphql";
import {
  Context,
  AuthenticationError,
  ForbiddenError,
  ApolloError,
} from "apollo-server-core";
import { CContext, Topic, CreateType } from "../types";
import {
  DriverApplication,
  IDriverApplication,
} from "./../models/driverApplication";
import Container from "typedi";
import { IsEmail } from "class-validator";
import { DriverApplicationService } from "./../services/driverApplication";
import { DriverService } from "../services/driver";
import { PersonService } from "./../services/person";
import { InstitutionService } from "../services/institution";
import { Role } from "../models/person";
import { Driver } from "../models/driver";
import { IApplication } from "../models/application";
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "./types";
import { UserService } from "./../services/user";
import { User } from "../models/user";

@InputType()
class InvitationDriversInput {
  @IsEmail({}, { each: true })
  @Field(() => [String])
  emails: string[];
}

@Resolver()
export class DriverApplicationResolver {
  constructor(
    private readonly driverApplicationService: DriverApplicationService,
    private readonly driverService: DriverService,
    private readonly userService: UserService
  ) {
    this.driverService = Container.get(DriverService);
    this.userService = Container.get(UserService);
    this.driverApplicationService = Container.get(DriverApplicationService);
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Query(() => [DriverApplication])
  async driverApplications(
    @Ctx() ctx: Context<CContext>
  ): Promise<DriverApplication[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    return await this.driverApplicationService.getAllOfInst(
      new ObjectId(activeUser.teacher.institutionId)
    );
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => [DriverApplication])
  async invitationDrivers(
    @Arg("input", () => InvitationDriversInput) input: InvitationDriversInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<DriverApplication[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher) throw new AuthenticationError("");
    const { emails } = input;
    const applications: CreateType<DriverApplication>[] = [];
    const users = await this.userService.getManyByEmail(emails);
    const emailList = new Set(emails);
    for (const user of users) {
      if (user.email) emailList.delete(user.email);
      if (
        !user.driver?.institutions.some(
          (i) =>
            i.institutionId.toHexString() === activeUser.teacher?.institutionId
        )
      ) {
        applications.push({
          email: user.email,
          userId: user._id,
          status: 1,
          institutionId: new ObjectId(activeUser.teacher.institutionId),
        });
      }
    }
    for (const email of emailList.values()) {
      applications.push({
        email: email,
        status: 0,
        institutionId: new ObjectId(activeUser.teacher.institutionId),
      });
    }

    const promises: Promise<void>[] = [];
    try {
      const newApplications = await this.driverApplicationService.createMany(
        applications
      );
      newApplications.forEach((a) => promises.push(a.sendInvatation()));
      await Promise.all(promises);
      return newApplications;
    } catch (error) {
      throw error;
    }
  }
  @Authorized(Role.DRIVER)
  @Query(() => [DriverApplication])
  async driverJobRequests(
    @Ctx() ctx: Context<CContext>
  ): Promise<DriverApplication[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return await this.driverApplicationService.getManyByUserId(
      new ObjectId(activeUser._id)
    );
  }
  @Authorized(Role.DRIVER)
  @Mutation(() => DriverApplication)
  async acceptDriverInvitation(
    @Arg("invitationId", () => ObjectIdScalar) invitationId: ObjectId,
    @Ctx() ctx: Context<CContext>,
    @PubSub(Topic.applicaitonUpdated)
    publish: Publisher<DriverApplication>,
    @Arg("d", { nullable: true }) d?: boolean,
    @Arg("r", { nullable: true }) r?: boolean
  ): Promise<DriverApplication> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    let app: IApplication | null = null;
    if (d)
      app = await this.driverApplicationService.removeMine(
        invitationId,
        new ObjectId(activeUser._id)
      );
    else {
      app = await this.driverApplicationService.updateStatusByUserId(
        invitationId,
        new ObjectId(activeUser._id),
        r ? 1 : 2
      );

      app && publish(app.toObject());
    }
    if (app) return app;
    throw new ApolloError("Application didn't find");
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => User)
  async addDriver(
    @Arg("applicationId", () => ObjectIdScalar) applicationId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<User> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const application = await this.driverApplicationService.getById(
      new ObjectId(activeUser.teacher.institutionId),
      applicationId
    );
    if (!application || !application.userId)
      throw new ApolloError("Application didn't find.");
    const result = await this.driverService.addInst(
      new ObjectId(activeUser.teacher.institutionId),
      application.userId
    );
    if (!result) throw new ApolloError("Failed");
    await this.driverApplicationService.remove(
      new ObjectId(activeUser.teacher.institutionId),
      applicationId
    );
    const driver = await this.driverService.getById(application.userId);
    if (driver && (driver as User).driver) return driver as User;
    throw new ApolloError("");
  }
}
