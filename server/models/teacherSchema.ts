/* eslint-disable no-unused-vars */

import Joi from "@hapi/joi";
import { Field, ObjectType, ID } from "type-graphql";
import { Schema, Types } from "mongoose";
import { IUser, User } from "./user";
import { ObjectId } from "mongodb";
import { IPerson } from "./person";

@ObjectType()
class Teacher {
  constructor(addedBy: Types.ObjectId, userId: Types.ObjectId) {
    this.addedBy = addedBy;
    this.userId = userId;
  }
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => ID)
  addedBy: IUser["_id"];

  @Field(() => ID)
  userId: IUser["_id"];

  @Field(() => User, { nullable: true })
  readonly user?: User;

  @Field()
  startDate: Date;
}

interface ITeacher extends IPerson, Teacher {}
const weeklyScheduleSchema: Schema = new Schema({
  schoolId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  classId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  day: {
    type: Number,
    min: 0,
    max: 6,
    required: true,
  },
  startTime: {
    type: Number,
    min: 0,
    max: 23.59,
    required: true,
  },
  finishTime: {
    type: Number,
    min: 0,
    max: 23.59,
    required: true,
  },
  scheduleId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  lessonName: {
    type: String,
    minlength: 2,
    maxlength: 255,
  },
});
