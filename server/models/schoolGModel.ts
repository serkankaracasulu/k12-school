import { Schema, model, Document, Types } from "mongoose";
import Joi from "@hapi/joi";
import { ILessonG, LessonG } from "./lessonGModel";
import { Field, ObjectType, Int, ID } from "type-graphql";
import { ObjectId } from "mongodb";

@ObjectType()
export class ClassLesson {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => String)
  lessonId: ILessonG["_id"];

  @Field(() => LessonG, { nullable: true })
  readonly lesson?: LessonG;

  @Field(() => Int)
  count: number;

  @Field()
  required: boolean;
}

export interface IClassLesson extends Document, ClassLesson {
  _id: ObjectId;
}

@ObjectType()
export class ClassG {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => Int)
  level: number;

  @Field(() => [ClassLesson])
  lessons: ClassLesson[];
}

interface IClassG extends Document, ClassG {
  _id: ObjectId;
  lessons: Types.DocumentArray<IClassLesson>;
}

@ObjectType()
export class SchoolG {
  @Field(() => ID)
  _id: ObjectId;

  @Field()
  name: string;

  @Field(() => [ClassG])
  classes: ClassG[];
}

export interface ISchoolG extends Document, SchoolG {
  _id: ObjectId;
  classes: Types.DocumentArray<IClassG>;
}
const lessonsSchema: Schema = new Schema({
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  count: { type: Number, default: 1 },
  required: {
    type: Boolean,
    default: false,
  },
});

const classSchema: Schema = new Schema({
  level: {
    type: Number,
    min: 0,
    max: 50,
    required: true,
  },
  lessons: [lessonsSchema],
});

const schoolSchema: Schema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
      unique: true,
      required: true,
    },
    classes: [classSchema],
  },
  { timestamps: true }
);

export const School = model<ISchoolG>("School", schoolSchema);
