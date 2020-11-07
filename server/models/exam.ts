import { Schema, model, Document, Types } from "mongoose";
import Joi from "@hapi/joi";
import { Field, ObjectType, Int, ID } from "type-graphql";
import { ILesson, WeeklySchedule } from "./lessonSchema";
import { Term, EducationYear } from "./educationYear";
import { IInstitution } from "./Institution";
import { Student } from "./student";
import { ObjectId } from "mongodb";

@ObjectType()
export class Grade {
  constructor(studentId: ObjectId, grade: number) {
    this.studentId = studentId;
    this.grade = grade;
  }
  @Field(() => ID)
  _id: ObjectId = new ObjectId();

  @Field(() => ID)
  studentId: Student["_id"];

  @Field(() => Int)
  grade: number;
}

interface IGrade extends Document, Grade {
  _id: ObjectId;
}

const GradeSchema: Schema<IGrade> = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
});
@ObjectType()
export class Exam {
  @Field(() => ID)
  _id: Document["_id"];

  @Field(() => ID)
  institutionId: IInstitution["_id"];

  @Field(() => ID)
  lessonId: ILesson["_id"];

  @Field()
  date: Date;

  @Field(() => ID)
  termId: Term["_id"];

  @Field(() => ID)
  educationYearId: EducationYear["_id"];

  @Field(() => [Int])
  lessonHourCode: WeeklySchedule["hourCode"][];

  @Field(() => String)
  readonly termName: Term["name"];

  @Field(() => [Grade])
  grades: Grade[];
}

export interface IExam extends Document, Exam {
  grades: Types.DocumentArray<IGrade>;
}

const ExamSchema = new Schema<IExam>({
  institutionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  educationYearId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  termId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  lessonHourCode: {
    type: [Number],
    required: true,
  },
  grades: [GradeSchema],
});
ExamSchema.index({
  lessonId: 1,
  institutionId: 1,
  educationYearId: 1,
  date: 1,
});
export const ExamModel = model<IExam>("exam", ExamSchema);
