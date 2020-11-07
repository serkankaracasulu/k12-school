/* eslint-disable no-unused-vars */
import { classSchema, IClass, ClassType } from "./classSchema";
import { Field, ObjectType, Int, ID } from "type-graphql";
import { Schema, Document, Types } from "mongoose";
import { hourSchema, IWeeklyHour, WeeklyHour } from "./hourSchema";
import Joi from "@hapi/joi";
import { ISchoolG } from "./schoolGModel";
import {
  EducationYear,
  IEducationYear,
  ITerm,
  educationYearSchema,
} from "./educationYear";
import {
  Address,
  addressLocationSchema,
  AddressLocation,
  IAddressLocation,
} from "./address";
import { ObjectId } from "mongodb";
import { Person, IPerson } from "./person";
import { IUser, User } from "./user";

@ObjectType()
export class School {
  @Field(() => ID)
  _id: ObjectId;

  @Field({ nullable: true })
  eOkulCode?: string;

  @Field()
  name: string;

  @Field(() => ID, { nullable: true })
  schoolKindId?: ISchoolG["_id"];

  @Field({ nullable: true })
  readonly schoolKindName?: string;

  @Field(() => ID, { nullable: true })
  headMasterId?: ObjectId;

  @Field(() => User, { nullable: true })
  readonly headMaster?: User;

  @Field(() => WeeklyHour, { nullable: true })
  weeklyHour?: WeeklyHour;

  @Field(() => [EducationYear])
  educationYears: EducationYear[];

  @Field(() => [ClassType])
  classes: ClassType[];

  @Field(() => Int)
  readonly studentCount?: number;

  @Field(() => AddressLocation, { nullable: true })
  address?: AddressLocation;
}

export interface ISchool extends Document, School {
  _id: ObjectId;
  headMaster?: IUser;
  weeklyHour?: IWeeklyHour;
  address?: IAddressLocation;
  educationYears: Types.DocumentArray<IEducationYear>;
  classes: Types.DocumentArray<IClass>;
  getEducationYearByDateRange(
    start: Date,
    end: Date
  ): [IEducationYear, ITerm] | undefined;
}

export const schoolSchema = new Schema<ISchool>(
  {
    eOkulCode: {
      type: String,
      minlength: 4,
      maxlength: 10,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
      required: true,
    },
    schoolKindId: {
      type: Schema.Types.ObjectId,
      ref: "School",
    },
    headMasterId: Schema.Types.ObjectId,
    weeklyHour: hourSchema,
    educationYears: [educationYearSchema],
    classes: [classSchema],
    address: addressLocationSchema,
  },
  { timestamps: true }
);
schoolSchema.methods.getEducationYearByDateRange = function (
  start: Date,
  end: Date
) {
  let index = 0;
  while (index < this.educationYears.length) {
    const educationYear = this.educationYears[index];
    const term = educationYear.getTermByDateRange(start, end);
    index += 1;
    if (term) {
      return [educationYear, term];
    }
  }
};
