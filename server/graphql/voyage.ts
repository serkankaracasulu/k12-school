import { ApolloError } from "apollo-server";
import { AuthenticationError, Context } from "apollo-server-core";
import { Length } from "class-validator";
import { ObjectId } from "mongodb";
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  Float,
  InputType,
  Int,
  Mutation,
  Publisher,
  PubSub,
  Query,
  Resolver,
  ResolverFilterData,
  ResolverInterface,
  Root,
  Subscription,
} from "type-graphql";
import { Container } from "typedi";

import { Role } from "../models/person";
import { School } from "../models/schoolSchema";
import { IVoyage, Voyage, VoyageTime } from "../models/voyage";
import {
  CoordinatesType,
  PositionType,
  VoyagePosition,
} from "../models/VoyagePosition";
import { InstitutionService } from "../services/institution";
import { SchoolService } from "../services/school";
import { VoyageService } from "../services/voyage";
import { CContext, Topic } from "../types";
import { ObjectIdScalar, Result, VoyageTimeInput } from "./types";
import VoyagePositionService from "./../services/voyagePosition";
import { Point } from "./../models/VoyagePosition";

@InputType()
class CreateVoyageInput implements Partial<Voyage> {
  @Length(2, 100)
  @Field()
  title: string;

  @Field(() => ObjectIdScalar)
  institutionId: ObjectId;

  @Field(() => ObjectIdScalar)
  schoolId: ObjectId;

  @Field(() => [VoyageTimeInput])
  times: VoyageTimeInput[];
}
@InputType()
class CoordinatesInput implements Partial<CoordinatesType> {
  @Field(() => Int)
  accuracy: number;
  @Field(() => Int, { nullable: true })
  altitude: number | null;
  @Field(() => Int, { nullable: true })
  altitudeAccuracy: number | null;
  @Field(() => Int, { nullable: true })
  heading: number | null;
  @Field(() => Float)
  latitude: number;
  @Field(() => Float)
  longitude: number;
  @Field(() => Int, { nullable: true })
  speed: number | null;
}
@InputType()
class PositionInput {
  @Field(() => CoordinatesInput)
  coords: CoordinatesInput;

  @Field(() => Float)
  timestamp: number;
}
@InputType()
class StartPositionInput {
  @Field(() => PositionInput)
  position: PositionInput;

  @Field(() => ObjectIdScalar)
  voyageId: ObjectId;

  @Field(() => ObjectIdScalar)
  timeId: ObjectId;
}
@InputType()
class UpdatePositionInput extends StartPositionInput {
  @Field(() => ObjectIdScalar)
  sessionId: ObjectId;
}

@InputType()
class StopPositionInput {
  @Field(() => ObjectIdScalar)
  voyageId: ObjectId;

  @Field(() => ObjectIdScalar)
  timeId: ObjectId;
}

@Resolver(() => Voyage)
export class VoyageFieldResolver implements ResolverInterface<Voyage> {
  constructor(
    private readonly institutionService: InstitutionService,
    private readonly schoolService: SchoolService
  ) {
    this.institutionService = Container.get(InstitutionService);
    this.schoolService = Container.get(SchoolService);
  }
  @FieldResolver(() => String)
  async institutionName(@Root() voyage: IVoyage | Voyage) {
    const inst = await this.institutionService.getById(voyage.institutionId);
    if (!inst) return "";
    return inst.name;
  }
  @FieldResolver(() => School)
  async school(@Root() voyage: IVoyage | Voyage) {
    return await this.schoolService.getById(
      voyage.institutionId,
      voyage.schoolId
    );
  }
}

@Resolver()
export class VoyageResolver {
  readonly #voyagePositionService = Container.get(VoyagePositionService);
  constructor(private readonly voyageService: VoyageService) {
    this.voyageService = Container.get(VoyageService);
  }

  @Authorized(Role.DRIVER)
  @Query(() => [Voyage])
  async voyages(@Ctx() ctx: Context<CContext>): Promise<Voyage[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return await this.voyageService.getManyByInstId(
      new ObjectId(activeUser._id)
    );
  }

  @Authorized(Role.PARENT)
  @Query(() => [Voyage])
  async studentVoyages(
    @Ctx() ctx: Context<CContext>,
    @Arg("parentStudentId", () => ObjectIdScalar)
    parentStudentId: ObjectId
  ): Promise<Voyage[]> {
    const { activeUser, requestParent } = ctx;
    if (!activeUser || !requestParent) throw new AuthenticationError("");
    return await this.voyageService.getManyByStudentId(
      new ObjectId(requestParent.studentId)
    );
  }
  @Authorized(Role.DRIVER)
  @Query(() => Voyage)
  async voyage(
    @Ctx() ctx: Context<CContext>,
    @Arg("voyageId", () => ObjectIdScalar) voyageId: ObjectId
  ): Promise<Voyage> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const voyage = await this.voyageService.getById(voyageId);
    if (!voyage) throw new ApolloError("Voyage didn't find");
    return voyage;
  }
  @Authorized(Role.DRIVER)
  @Mutation(() => VoyageTime)
  async startPosition(
    @Ctx() ctx: Context<CContext>,
    @Arg("data", () => StartPositionInput) data: StartPositionInput,
    @PubSub(Topic.positionNotification)
    publish: Publisher<VoyagePosition>
  ): Promise<VoyageTime> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const { position, timeId, voyageId } = data;
    const { coords, timestamp } = position;
    const payload = {
      positions: [
        {
          coords: {
            point: new Point(coords.latitude, coords.latitude),
            ...coords,
          },
          timestamp: new Date(timestamp),
        },
      ],
      voyageId,
      driverId: new ObjectId(activeUser._id),
      voyageTimeId: timeId,
      sessionId: new ObjectId(),
    };
    const voyagePosition = await this.#voyagePositionService.create(payload);
    if (!voyagePosition) throw new ApolloError(" ");

    const voyageTime = await this.voyageService.updateVoyageStart(
      voyageId,
      timeId,
      voyagePosition.sessionId
    );

    if (!voyageTime) throw new ApolloError("Voyage time didn't find");
    if (voyagePosition) publish(voyagePosition);
    return voyageTime;
  }
  @Authorized(Role.DRIVER)
  @Mutation(() => PositionType)
  async updatePosition(
    @Ctx() ctx: Context<CContext>,
    @Arg("data", () => UpdatePositionInput) data: UpdatePositionInput,
    @PubSub(Topic.positionNotification)
    publish: Publisher<PositionType>
  ): Promise<PositionType> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const { position, timeId, voyageId, sessionId } = data;
    const driverId = new ObjectId(activeUser._id);
    const { latitude, longitude, ...restCoord } = position.coords;
    const voyagePosition = await this.#voyagePositionService.addPosition(
      driverId,
      sessionId,
      voyageId,
      timeId,
      {
        coords: { point: new Point(latitude, longitude), ...restCoord },
        timestamp: new Date(position.timestamp),
      }
    );
    if (voyagePosition) {
      publish(voyagePosition);
      return voyagePosition;
    }
    throw new ApolloError("Error");
  }
  @Subscription(() => PositionType, {
    topics: Topic.positionNotification,
    filter: ({
      payload,
      context,
    }: ResolverFilterData<PositionType, void, CContext>) => {
      if (context.activeUser) return true;
      return false;
    },
  })
  positionNotification(@Root() position: PositionType): PositionType {
    return position;
  }
  @Authorized(Role.DRIVER)
  @Mutation(() => VoyageTime)
  async stopPosition(
    @Ctx() ctx: Context<CContext>,
    @Arg("data", () => StopPositionInput) data: StopPositionInput
  ): Promise<VoyageTime> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const voyageTime = await this.voyageService.updateVoyageStop(
      data.voyageId,
      data.timeId
    );
    if (voyageTime) return voyageTime;
    throw new ApolloError("Error");
  }

  @Authorized(Role.DRIVER)
  @Mutation(() => Voyage)
  async createVoyage(
    @Ctx() ctx: Context<CContext>,
    @Arg("data", () => CreateVoyageInput) data: CreateVoyageInput
  ): Promise<Voyage> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const { times, ...rest } = data;
    const newVoyage = await this.voyageService.create(
      {
        ...rest,
        driverId: new ObjectId(activeUser._id),
      },
      times
    );
    if (newVoyage) return newVoyage;
    throw new ApolloError("Failed");
  }
  @Authorized(Role.DRIVER)
  @Mutation(() => Result)
  async addStudentVoyage(
    @Ctx() ctx: Context<CContext>,
    @Arg("voyageId", () => ObjectIdScalar) voyageId: ObjectId,
    @Arg("studentId", () => ObjectIdScalar) studentId: ObjectId
  ): Promise<Result> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const result = await this.voyageService.addStudent(
      studentId,
      voyageId,
      new ObjectId(activeUser._id)
    );
    return { success: result };
  }
  @Authorized(Role.DRIVER)
  @Mutation(() => Result)
  async removeStudentVoyage(
    @Ctx() ctx: Context<CContext>,
    @Arg("voyageId", () => ObjectIdScalar) voyageId: ObjectId,
    @Arg("studentId", () => ObjectIdScalar) studentId: ObjectId
  ): Promise<Result> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const result = await this.voyageService.removeStudent(
      studentId,
      voyageId,
      new ObjectId(activeUser._id)
    );
    return { success: result };
  }
}
