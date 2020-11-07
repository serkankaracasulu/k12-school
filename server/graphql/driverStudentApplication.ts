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
import { CContext, Topic } from "../types";
import Container from "typedi";
import { DriverService } from "../services/driver";
import { PersonService } from "./../services/person";
import { InstitutionService } from "../services/institution";
import { Role } from "../models/person";
import {
  DriverStudentApplication,
  IDriverStudentApplication,
} from "../models/driverStudentApplication";
import { DriverStudentApplicationService } from "../services/driverStudentApplication";
import { ObjectIdScalar, RemoveResult, Result } from "./types";
import { ObjectId } from "mongodb";
import { Address } from "../models/address";
import { User } from "../models/user";

@Resolver(() => DriverStudentApplication)
export class DriverStudentApplicationFieldResolver {
  constructor(
    private readonly institutionService: InstitutionService,
    private readonly personService: PersonService
  ) {
    this.institutionService = Container.get(InstitutionService);
    this.personService = Container.get(PersonService);
  }

  @FieldResolver(() => String)
  async institutionName(
    @Root() application: IDriverStudentApplication,
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
    @Root() application: IDriverStudentApplication,
    @Ctx() ctx: Context<CContext>
  ): Promise<string> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    if (!application.userId) return "";
    const user = await this.personService.getById(application.userId);
    if (user && typeof user.fullName === "string") return user.fullName;
    return "";
  }
  @FieldResolver(() => Address)
  async address(
    @Root() application: IDriverStudentApplication,
    @Ctx() ctx: Context<CContext>
  ): Promise<Address | null | undefined> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    if (!application.userId) return null;
    const user = await this.personService.getById(application.userId);
    return user?.address;
  }
}

@Resolver()
export class DriverStudentApplicationResolver {
  constructor(
    private readonly driverStudentApplicationService: DriverStudentApplicationService,
    private readonly driverService: DriverService
  ) {
    this.driverService = Container.get(DriverService);
    this.driverStudentApplicationService = Container.get(
      DriverStudentApplicationService
    );
  }
  @Authorized(Role.PARENT)
  @Query(() => [DriverStudentApplication])
  async studentServiceRequests(
    @Ctx() ctx: Context<CContext>,
    @Arg("parentStudentId", () => ObjectIdScalar) parentStudentId: ObjectId
  ): Promise<DriverStudentApplication[]> {
    const { activeUser, requestParent } = ctx;
    if (!activeUser || !requestParent) throw new AuthenticationError("");
    return await this.driverStudentApplicationService.getManyByUserId(
      new ObjectId(requestParent.studentId)
    );
  }
  @Authorized(Role.PARENT)
  @Mutation(() => DriverStudentApplication)
  async sendInvitationDriver(
    @Arg("driverId", () => ObjectIdScalar)
    driverId: ObjectId,
    @Ctx() ctx: Context<CContext>,
    @Arg("parentStudentId", () => ObjectIdScalar) parentStudentId: ObjectId
  ): Promise<DriverStudentApplication> {
    const { activeUser, requestParent } = ctx;
    if (!activeUser || !requestParent) throw new AuthenticationError("");
    const driver = await this.driverService.getById(driverId);
    if (!driver || !(driver as User).driver)
      throw new ApolloError("Driver didn't find");
    try {
      const newApplications = await this.driverStudentApplicationService.create(
        {
          institutionId: new ObjectId(requestParent.institutionId),
          status: 1,
          driverId,
          userId: new ObjectId(requestParent.studentId),
          parentId: new ObjectId(activeUser._id),
          email: driver.email,
        },
        new ObjectId(requestParent.studentId)
      );
      if (newApplications.email) await newApplications.sendInvatation();
      return newApplications;
    } catch (error) {
      throw error;
    }
  }
  @Authorized(Role.DRIVER)
  @Query(() => [DriverStudentApplication])
  async driverServiceRequests(
    @Ctx() ctx: Context<CContext>
  ): Promise<DriverStudentApplication[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return await this.driverStudentApplicationService.getManyByDriverId(
      new ObjectId(activeUser._id)
    );
  }
  @Authorized(Role.DRIVER)
  @Mutation(() => Result)
  async acceptDriverServiceInvitation(
    @Arg("invitationId", () => ObjectIdScalar) invitationId: ObjectId,
    @Ctx() ctx: Context<CContext>,
    @PubSub(Topic.applicaitonUpdated)
    publish: Publisher<DriverStudentApplication>
  ): Promise<Result> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const application = await this.driverStudentApplicationService.getByDriverId(
      invitationId,
      new ObjectId(activeUser._id)
    );
    if (!application) throw new ApolloError("Applicaiton didn't find", "202");
    const result = await this.driverService.addStudent(
      new ObjectId(activeUser._id),
      application.userId,
      application.institutionId
    );
    const acceptResult = await this.driverStudentApplicationService.acceptByDriverId(
      new ObjectId(activeUser._id),
      invitationId
    );
    return {
      success: result,
    };
  }
  @Authorized(Role.DRIVER)
  @Mutation(() => RemoveResult)
  async cancelServiceRequestDriver(
    @Ctx() ctx: Context<CContext>,
    @Arg("requestId", () => ObjectIdScalar) requestId: ObjectId
  ): Promise<RemoveResult> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const request = await this.driverStudentApplicationService.removeByDriverId(
      new ObjectId(activeUser._id),
      requestId
    );
    if (!request) throw new ApolloError("Request didn't find");
    const result = await this.driverService.removeStudent(
      new ObjectId(activeUser._id),
      request.userId,
      request.institutionId
    );
    return { code: "200", success: result, _id: requestId.toHexString() };
  }
  @Authorized(Role.PARENT)
  @Mutation(() => RemoveResult)
  async cancelServiceRequestUser(
    @Ctx() ctx: Context<CContext>,
    @Arg("requestId", () => ObjectIdScalar) requestId: ObjectId,
    @Arg("parentStudentId", () => ObjectIdScalar) parentStudentId: ObjectId
  ): Promise<RemoveResult> {
    const { activeUser, requestParent } = ctx;
    if (!activeUser || !requestParent) throw new AuthenticationError("");
    const result = await this.driverStudentApplicationService.removeMine(
      requestId,
      new ObjectId(requestParent.studentId)
    );
    if (result)
      await this.driverService.removeStudent(
        result.driverId,
        new ObjectId(requestParent.studentId),
        new ObjectId(requestParent.institutionId)
      );
    return { code: "200", success: !!result, _id: requestId.toHexString() };
  }
}
