import Joi from "@hapi/joi";
import { Schema, Document, model } from "mongoose";
import { Field, ObjectType, Int, ID } from "type-graphql";
import { School } from "./schoolSchema";
import { IUser, User } from "./user";
import { ILessonG, LessonG } from "./lessonGModel";
import { Types } from "mongoose";
import { Hour } from "./hourSchema";
import { Institution } from "./Institution";
import { ClassType } from "./classSchema";
import { Person } from "./person";
import { EducationYear, IEducationYear } from "./educationYear";
import { ObjectId } from "mongodb";

@ObjectType()
export class WeeklySchedule {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => Int)
  day: number;

  @Field(() => Int)
  hourCode: Hour["code"];
}

@ObjectType()
export class LessonBase {
  @Field(() => ID)
  _id: ObjectId;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int)
  weeklyHour: number;

  @Field(() => ID, { nullable: true })
  teacherId?: IUser["_id"];

  @Field(() => ID)
  institutionId: Institution["_id"];

  @Field(() => ID)
  schoolId: School["_id"];

  @Field(() => User, { nullable: true })
  readonly teacher?: Person;

  @Field(() => ID)
  educationYearId: EducationYear["_id"];

  @Field()
  createdAt: Date;

  @Field(() => [WeeklySchedule])
  lessonWeeklySchedules: WeeklySchedule[];
}

interface IWeeklySchedule extends Document, WeeklySchedule {
  _id: ObjectId;
}

@ObjectType()
export class Lesson extends LessonBase {
  @Field(() => ID, { nullable: true })
  lessonId?: ILessonG["_id"];

  @Field({ nullable: true })
  readonly lessonName?: string;

  @Field(() => ID)
  classId: ClassType["_id"];
}

export interface ILessonBase extends LessonBase, Document {
  _id: ObjectId;
}

export interface ILesson extends ILessonBase, Lesson {
  lessonWeeklySchedules: Types.DocumentArray<IWeeklySchedule>;
}

const weeklyScheduleSchema = new Schema<IWeeklySchedule>({
  day: {
    type: Number,
    min: 0,
    max: 6,
    required: true,
  },
  hourCode: {
    type: Number,
    min: 1,
    max: 18,
    required: true,
  },
});
export const LessonBaseSchema = new Schema<ILessonBase>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
    },
    weeklyHour: {
      type: Number,
      min: 0,
      max: 49,
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    educationYearId: {
      type: Schema.Types.ObjectId,
      index: true,
      required: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      index: true,
      required: true,
    },
    institutionId: {
      type: Schema.Types.ObjectId,
      index: true,
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    lessonWeeklySchedules: {
      type: [weeklyScheduleSchema],
    },
  },
  { timestamps: true, discriminatorKey: "kind" }
);
export const LessonBaseModel = model("LessonBase", LessonBaseSchema);
export const lessonSchema = new Schema<ILesson>({
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
  },
  classId: {
    type: Schema.Types.ObjectId,
    index: true,
    required: true,
  },
});

export const ClassLessonModel = LessonBaseModel.discriminator<ILesson>(
  "classLesson",
  lessonSchema
);
