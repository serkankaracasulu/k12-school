/* eslint-disable no-unused-vars */

import { DateTime } from "luxon";
import { Field, ObjectType, Int, ID } from "type-graphql";
import { Kind } from "graphql";
import { Schema, Document } from "mongoose";
import Joi from "@hapi/joi";
import { Types } from "mongoose";
import { GraphQLScalarType } from "graphql/type/definition";
import { ObjectId } from "mongodb";

export const TimeScalar = new GraphQLScalarType({
  name: "Time",
  description: "HH:mm",
  parseValue(time: string) {
    const [hour, minute] = time.toString().split(":");
    if (!hour || !minute || hour.length !== 2 || minute.length !== 2)
      throw new Error("Time parse failed");
    return new Date(Date.UTC(2000, 0, 1, +hour, +minute, 0));
  },
  serialize(value: Date) {
    return DateTime.fromJSDate(value).setZone("utc").toFormat("HH:mm");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value; // value from the client query
    }
    return null;
  },
});

@ObjectType()
export class Hour {
  @Field(() => ID)
  _id: ObjectId;

  @Field((type) => Int)
  code: number;

  @Field(() => TimeScalar)
  start: Date;

  @Field(() => TimeScalar)
  finish: Date;
}

export interface IHour extends Document, Hour {
  _id: ObjectId;
}

@ObjectType()
export class WeeklyHour {
  @Field(() => ID)
  _id: ObjectId;

  @Field()
  name: string;

  @Field(() => [Hour])
  hour: Hour[];
}

export interface IWeeklyHour extends Document, WeeklyHour {
  _id: ObjectId;

  hour: Types.DocumentArray<IHour>;
  /**
   *Returns IHour in the given time range
   */
  instersectionHours(hour: Hour): IHour[];
}
const hourInfoSchema = new Schema<IHour>({
  code: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    required: true,
  },
  start: {
    type: Date,
    min: "2000-01-01",
    max: "2000-01-01",
  },
  finish: {
    type: Date,
    min: "2000-01-01",
    max: "2000-01-01",
  },
});

export const hourSchema = new Schema<IWeeklyHour>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true,
    },
    hour: { type: [hourInfoSchema], required: true },
  },
  { timestamps: true }
);
hourSchema.methods.instersectionHours = function (hour: Hour) {
  const startValue = hour.start.valueOf();
  const finishValue = hour.finish.valueOf();
  return this.hour.filter(
    (h) =>
      (h.finish.valueOf() <= finishValue && h.finish.valueOf() >= startValue) ||
      (h.start.valueOf() <= finishValue && h.start.valueOf() >= startValue) ||
      (h.start.valueOf() <= startValue && h.finish.valueOf() >= finishValue)
  );
};
