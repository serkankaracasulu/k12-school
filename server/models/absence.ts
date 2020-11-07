import { Schema, Document, Types, model } from "mongoose";
import { Field, ObjectType, Int, ID } from "type-graphql";
import { Lesson, WeeklySchedule } from "./lessonSchema";
import { Student } from "./student";
import { User } from "./user";
import { DateTime } from "luxon";
import { ObjectId } from "mongodb";

@ObjectType()
export class Absence {
  constructor(
    lessonId: ObjectId,
    hourCode: number,
    time: Date,
    teacherId: ObjectId,
    studentId: ObjectId
  ) {
    const now = DateTime.utc();
    this.lessonId = lessonId;
    this.teacherId = teacherId;
    this.studentId = studentId;
    this.hourCode = hourCode;
    this.date = new Date(
      Date.UTC(
        now.year,
        now.month - 1,
        now.day,
        time.getUTCHours(),
        time.getUTCMinutes()
      )
    );
    this.day = now.weekday - 1;
  }
  @Field(() => ID)
  _id: ObjectId = new ObjectId();

  @Field(() => ID)
  lessonId: Lesson["_id"];

  @Field()
  date: Date;

  @Field(() => Int)
  day: WeeklySchedule["day"];

  @Field(() => Int)
  hourCode: WeeklySchedule["hourCode"];

  @Field(() => ID)
  studentId: Student["_id"];

  @Field(() => ID)
  teacherId: User["_id"];
}
export interface IAbsence extends Absence, Document {
  _id: ObjectId;
}

const absenceSchema = new Schema<IAbsence>({
  lessonId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  studentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Student",
  },
  day: {
    type: Number,
    required: true,
  },
  hourCode: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    index: true,
  },
});
absenceSchema.index({ studentId: 1, date: -1 }, { unique: true });
export const AbsenceModel = model<IAbsence>("Absence", absenceSchema);
