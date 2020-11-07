/* eslint-disable no-unused-vars */

import Joi from "@hapi/joi";
import { Schema, Document, Types } from "mongoose";
import { Field, ObjectType, Int, ID } from "type-graphql";
import { lessonSchema, ILesson, Lesson } from "./lessonSchema";
import { IUser, User } from "./user";
import { ObjectId } from "mongodb";

@ObjectType()
export class ClassType {
  @Field(() => ID)
  _id: ObjectId;

  @Field({ nullable: true })
  name?: string;

  @Field((type) => Int)
  level: number;

  @Field({ nullable: true })
  code?: string;

  @Field({ nullable: true })
  code1?: string;

  @Field()
  createdAt: Date;

  @Field()
  fullName?: string;

  @Field((type) => ID, { nullable: true })
  classroomTeacherId?: IUser["_id"];

  @Field((type) => User, { nullable: true })
  readonly classroomTeacher?: User;

  @Field(() => Int)
  readonly studentCount?: number;

  @Field(() => Int)
  readonly lessonCount?: number;

  @Field(() => [Lesson])
  readonly lessons?: Lesson[];
}
export interface IClass extends Document, ClassType {
  _id: ObjectId;
  lessons: undefined;
}

export const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
    },
    level: {
      type: Number,
      min: 0,
      max: 50,
    },
    code: {
      type: String,
      maxlength: 3,
    },
    code1: {
      type: String,
      minlength: 2,
      maxlength: 255,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    classroomTeacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
