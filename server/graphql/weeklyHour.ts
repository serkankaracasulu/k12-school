import {
  Resolver,
  Ctx,
  Arg,
  Query,
  Authorized,
  Field,
  InputType,
  Mutation,
  Int,
} from "type-graphql";
import { Context, ApolloError, AuthenticationError } from "apollo-server-core";
import { WeeklyHour, TimeScalar, Hour } from "../models/hourSchema";
import { CContext } from "../types";
import { Role } from "../models/person";
import { Container } from "typedi";
import { WeeklyHourService } from "./../services/weeklyHour";
import { IsMongoId, IsInt, Max, Min, Length } from "class-validator";
import { ObjectIdScalar } from "./types";
import { ObjectId } from "mongodb";

@InputType()
class HourInput implements Partial<Hour> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id: ObjectId;

  @Min(1)
  @Max(18)
  @IsInt()
  @Field(() => Int)
  code: number;

  @Field(() => TimeScalar)
  start: Date;

  @Field(() => TimeScalar)
  finish: Date;
}

@InputType()
class CreateHourInput implements Partial<WeeklyHour> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id: ObjectId;

  @Field(() => ObjectIdScalar)
  schoolId: ObjectId;

  @Length(2, 50)
  @Field()
  name: string;

  @Field(() => [HourInput])
  hour: HourInput[];
}

@Resolver()
export class WeeklyHourResolver {
  constructor(private readonly weeklyHourService: WeeklyHourService) {
    this.weeklyHourService = Container.get(WeeklyHourService);
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Query(() => WeeklyHour)
  async hours(
    @Ctx() ctx: Context<CContext>,
    @Arg("id", () => ObjectIdScalar) id: ObjectId,
    @Arg("schoolId", () => ObjectIdScalar) schoolId: ObjectId
  ): Promise<WeeklyHour> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const weeklyHour = await this.weeklyHourService.getById(
      new ObjectId(activeUser.teacher.institutionId),
      schoolId
    );
    if (weeklyHour) return weeklyHour;
    throw new ApolloError("Weekly hour didn't find");
  }
  @Authorized(Role.ADMIN, Role.OWNER)
  @Mutation(() => WeeklyHour)
  async createHour(
    @Arg("data") data: CreateHourInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<WeeklyHour> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const { schoolId, ...weeklyHour } = data;
    const newWeeklyHour = await this.weeklyHourService.create(
      new ObjectId(activeUser.teacher.institutionId),
      schoolId,
      weeklyHour
    );
    if (!newWeeklyHour) throw new ApolloError("Failed");
    return newWeeklyHour;
  }
}
