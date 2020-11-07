import { Schema, model, Document, Model, Types } from "mongoose";
import Joi from "@hapi/joi";
import { Field, ObjectType, Int, ID, registerEnumType } from "type-graphql";
import { Lesson } from "./lessonSchema";
import { ObjectId } from "mongodb";
import { Institution } from "./Institution";
import { User } from "./user";

export enum LessonMessageType {
  announcement = "announcement",
  homework = "homework",
}
registerEnumType(LessonMessageType, {
  name: "LessonMessageType",
});

@ObjectType()
export class LessonInbox {
  @Field(() => ID)
  _id: ObjectId = new ObjectId();

  @Field(() => ID)
  institutionId: Institution["_id"];

  @Field(() => ID)
  lessonId: Lesson["_id"];

  @Field()
  message: string;

  @Field()
  title: string;

  @Field(() => ID)
  teacherId: User["_id"];

  @Field()
  sent: Date = new Date(Date.now());

  @Field(() => LessonMessageType)
  messageType: LessonMessageType;
}

interface ILessonInbox extends Document, LessonInbox {
  _id: ObjectId;
}

const lessonInboxSchema: Schema = new Schema({
  institutionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Institution",
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
      expires: "365 days",
    },
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  messageType: {
    type: String,
    enum: Object.keys(LessonMessageType),
    required: true,
  },
});
lessonInboxSchema.index({
  institutionId: 1,
  lessonId: 1,
  sent: 1,
});
export const LessonInboxModel: Model<ILessonInbox> = model<ILessonInbox>(
  "lessonInbox",
  lessonInboxSchema
);
