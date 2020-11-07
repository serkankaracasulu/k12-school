import { Types } from "mongoose";
import { UserInputError } from "apollo-server";
import { ValidationResult } from "@hapi/joi";
import { Field, ObjectType, ID, InputType, Float, Int } from "type-graphql";
import { Stream } from "stream";
import { Address } from "../models/address";
import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";
import { VoyageTime } from "../models/voyage";
import { TimeScalar } from "../models/hourSchema";
import { Max, IsInt } from "class-validator";
export function checkValidate(
  value: object,
  schema: (obj: any) => ValidationResult
) {
  const { error } = schema(value);
  if (error) throw new UserInputError("error", error);
}

export function lessonPipeline(
  objId: string,
  schoolId: string,
  classId: string,
  lessonId: string | Types.ObjectId
) {
  return [
    {
      $match: {
        _id: new ObjectId(objId),
        "schools._id": new ObjectId(schoolId),
        "schools.classes._id": new ObjectId(classId),
        "schools.classes.lessons._id": new ObjectId(lessonId),
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$schools",
                as: "school",
                cond: {
                  $eq: ["$$school._id", new ObjectId(schoolId)],
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$classes",
                as: "class",
                cond: {
                  $eq: ["$$class._id", new ObjectId(classId)],
                },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$lessons",
                as: "lesson",
                cond: {
                  $eq: ["$$lesson._id", new ObjectId(lessonId)],
                },
              },
            },
            0,
          ],
        },
      },
    },
  ];
}

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

@ObjectType()
export class RemoveResult {
  @Field()
  code: string;

  @Field()
  success: boolean;

  @Field(() => ID)
  _id: string;
}

@ObjectType()
export class LoginToken {
  @Field()
  token: string;
}

@ObjectType()
export class UpdateResult {
  @Field()
  code: string;

  @Field()
  success: boolean;

  @Field(() => ID, { nullable: true })
  _id?: string;
}

@ObjectType()
export class UpdateResults {
  @Field()
  code: string;

  @Field()
  success: boolean;

  @Field(() => [ID!]!)
  _ids: string[];
}

@ObjectType()
export class Result {
  @Field()
  success: boolean;
}
@InputType()
export class AddressInput implements Partial<Address> {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lng: number;
}

@InputType()
export class VoyageTimeInput implements Partial<VoyageTime> {
  @IsInt()
  @Max(6)
  @Field(() => Int)
  day: VoyageTime["day"];

  @Field(() => TimeScalar)
  hour: Date;

  @Field()
  isTakeSchool: boolean;
}

export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo object id scalar type",
  parseValue(value: string) {
    return new ObjectId(value); // value from the client input variables
  },
  serialize(value: ObjectId): string {
    return value.toHexString(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value); // value from the client query
    }
    return null;
  },
});
