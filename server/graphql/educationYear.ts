import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  InputType,
  Field,
  Authorized,
} from "type-graphql";
import { RemoveResult, ObjectIdScalar } from "./types";
import { Context, AuthenticationError } from "apollo-server-core";
import { CContext } from "../types";
import { EducationYear, Term } from "../models/educationYear";
import { IsMongoId, Length } from "class-validator";
import { EducationYearService } from "./../services/educationYear";
import { Container } from "typedi";
import { Role } from "../models/person";
import { ObjectId } from "mongodb";

@InputType()
class TermInput implements Partial<Term> {
  _id: ObjectId;

  @Length(2, 255)
  @Field()
  name: string;

  @Field()
  start: Date;

  @Field()
  finish: Date;
}

@InputType()
class EducationYearInput implements Partial<EducationYear> {
  @Field(() => ObjectIdScalar)
  schoolId: ObjectId;

  @Length(2, 255)
  @Field()
  name: string;

  @Field(() => [TermInput!]!)
  terms: TermInput[];
}

@Resolver()
export class EducationYearResolver {
  constructor(private readonly educationYearService: EducationYearService) {
    this.educationYearService = Container.get(EducationYearService);
  }
  @Authorized(Role.ADMIN, Role.OWNER)
  @Mutation(() => EducationYear)
  async editEducationYear(
    @Arg("educationYear") educationYear: EducationYearInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<EducationYear> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const { schoolId, ...rest } = educationYear;
    const result = await this.educationYearService.create(
      rest,
      new ObjectId(activeUser.teacher.institutionId),
      schoolId
    );
    if (result) return result;
    throw new Error("Failed");
  }
  @Authorized(Role.ADMIN, Role.OWNER)
  @Mutation(() => RemoveResult)
  async deleteEducationYear(
    @Arg("schoolId", () => ObjectIdScalar) schoolId: ObjectId,
    @Arg("id", () => ObjectIdScalar) id: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<RemoveResult> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const result = await this.educationYearService.remove(
      new ObjectId(activeUser.teacher.institutionId),
      schoolId,
      id
    );
    return {
      code: "200",
      success: result,
      _id: result ? id.toHexString() : "",
    };
  }
}
