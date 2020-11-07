import { Schema, model, Document, Model } from "mongoose";
import { Field, ObjectType, Int, ID } from "type-graphql";
import Joi from "@hapi/joi";
import { ObjectId } from "mongodb";
import { ITeacherField, TeacherField } from "./teacherField";

@ObjectType()
export class LessonG {
  @Field(() => ID)
  _id: ObjectId;

  @Field()
  name: string;

  @Field(() => [TeacherField])
  teacherFields: TeacherField[];

  @Field(() => [String])
  teacherFieldIds: ITeacherField["_id"][];
}

export interface ILessonG extends Document, LessonG {
  _id: ObjectId;
}

const lessonSchema: Schema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
      unique: true,
    },
    teacherFieldIds: [{ type: Schema.Types.ObjectId, ref: "TeacherField" }],
  },
  { timestamps: true }
);

export const Lesson: Model<ILessonG> = model<ILessonG>("Lesson", lessonSchema);
