import {
  Resolver,
  Authorized,
  Ctx,
  Query,
  Arg,
  Mutation,
  ResolverInterface,
  FieldResolver,
  Root,
} from "type-graphql";
import { Context, AuthenticationError, ApolloError } from "apollo-server-core";
import { CContext } from "../types";
import Container from "typedi";
import { DriverService } from "../services/driver";
import { Driver, IDriver, DriverInstitution } from "../models/driver";
import { RemoveResult, ObjectIdScalar } from "./types";
import { Types } from "mongoose";
import { Role } from "./../models/person";
import { ObjectId } from "mongodb";
import { DriverStudentApplication } from "./../models/driverStudentApplication";
import { DriverStudentApplicationService } from "../services/driverStudentApplication";
import { InstitutionService } from "./../services/institution";
import { User } from "../models/user";
import { IUser } from "./../models/user";

@Resolver(() => DriverInstitution)
export class DriverInstitutionFieldResolver
  implements ResolverInterface<DriverInstitution> {
  constructor(private readonly institutionService: InstitutionService) {
    this.institutionService = Container.get(InstitutionService);
  }
  @FieldResolver(() => DriverStudentApplication)
  async institutionName(
    @Root() di: DriverInstitution,
    @Ctx() ctx: Context<CContext>
  ) {
    const inst = await this.institutionService.getById(di.institutionId);
    if (inst) return inst.name;
    return "";
  }
}

@Resolver(() => Driver)
export class DriverFieldResolver implements ResolverInterface<Driver> {
  constructor(
    private readonly driverStudentApplicationService: DriverStudentApplicationService,
    private readonly driverService: DriverService
  ) {
    this.driverStudentApplicationService = Container.get(
      DriverStudentApplicationService
    );
    this.driverService = Container.get(DriverService);
  }
  @Authorized(Role.PARENT)
  @FieldResolver(() => DriverStudentApplication)
  async requestApp(
    @Root() cl: IDriver | Driver,
    @Ctx() ctx: Context<CContext>,
    @Arg("parentStudentId", () => ObjectIdScalar) parentStudentId: ObjectId
  ) {
    const { requestParent } = ctx;
    if (!requestParent) return;
    const driver = await this.driverService.getByDriverId(cl._id);
    if (!driver) throw new Error("d");
    const app = await this.driverStudentApplicationService.getByDriverAndUserId(
      driver?._id,
      new ObjectId(requestParent.studentId)
    );
    if (app) return app;
  }
}

@Resolver()
export class DriverResolver {
  constructor(private readonly driverService: DriverService) {
    this.driverService = Container.get(DriverService);
  }
  @Authorized(Role.OWNER, Role.ADMIN, Role.PARENT)
  @Query(() => [User])
  async drivers(@Ctx() ctx: Context<CContext>): Promise<User[]> {
    const { activeUser, requestParent } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const instId =
      requestParent?.institutionId || activeUser.teacher?.institutionId;
    return await this.driverService.getManyByInstId(new ObjectId(instId));
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => RemoveResult)
  async dismissDriver(
    @Arg("driverId", () => ObjectIdScalar) driverId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<RemoveResult> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const result = await this.driverService.remove(
      driverId,
      Types.ObjectId(activeUser.teacher.institutionId)
    );
    return { code: "200", success: result, _id: driverId.toHexString() };
  }
  @Authorized(Role.PARENT)
  @Query(() => [User])
  async driversOfStudent(
    @Ctx() ctx: Context<CContext>,
    @Arg("parentStudentId", () => ObjectIdScalar) parentStudentId: ObjectId
  ): Promise<User[]> {
    const { activeUser, requestParent } = ctx;
    if (!activeUser || !requestParent) throw new AuthenticationError("");
    return await this.driverService.getDriversOfStudent(
      new ObjectId(requestParent.studentId),
      new ObjectId(requestParent.institutionId)
    );
  }
  @Authorized(Role.DRIVER)
  @Query(() => [DriverInstitution])
  async driverInsitutions(
    @Ctx() ctx: Context<CContext>
  ): Promise<DriverInstitution[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const driver = await this.driverService.getById(
      new ObjectId(activeUser._id)
    );
    if (!driver) throw new ApolloError("Driver didin't find");
    const insts = (driver as IUser).driver?.institutions;
    if (!insts) throw new Error("Failed");
    return insts.toObject();
  }
}
