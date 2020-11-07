/* eslint-disable no-unused-vars */

import Joi from "@hapi/joi";
import { Field, ObjectType, ID } from "type-graphql";
import { Schema, model, Document } from "mongoose";
import { ILesson } from "./lessonSchema";
import { IInstitution } from "./Institution";
import { ObjectId } from "mongodb";

@ObjectType()
export class HomeWork {
  constructor(
    institutionId: ObjectId,
    lessonId: ObjectId,
    title: string,
    message: string
  ) {
    this.institutionId = institutionId;
    this.lessonId = lessonId;
    this.title = title;
    this.message = message;
  }
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => ID)
  institutionId: IInstitution["_id"];

  @Field(() => ID)
  lessonId: ILesson["_id"];

  @Field()
  message: string;

  @Field()
  title: string;

  @Field()
  sent: Date = new Date(Date.now());

  @Field({ nullable: true })
  file?: string;
}

export interface IHomeWork extends Document, HomeWork {
  _id: ObjectId;
}

const homeWorkSchema: Schema = new Schema({
  institutionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500,
  },
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60,
  },
  sent: {
    type: Date,
    default: Date.now,
    index: {
      expires: "180 days",
    },
  },
  file: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
});
homeWorkSchema.index({
  institutionId: 1,
  lessonId: 1,
  sent: 1,
});
export const HomeWorkModel = model<IHomeWork>("homework", homeWorkSchema);
export function homeWork(values: object) {
  return Joi.object()
    .keys({
      lessonId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      schoolId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      classId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      message: Joi.string().min(1).max(1000).required(),
      title: Joi.string().min(1).max(100).required(),
      homeWorkFile: Joi.object(),
    })
    .validate(values);
}
export function homeWorkFileLink(values: object) {
  return Joi.object()
    .keys({
      lessonId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      homeWorkId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      fileName: Joi.string().min(1).max(1000).required(),
      t: Joi.string().required(),
    })
    .validate(values);
}
