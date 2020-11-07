import { Types, Schema, model, Document } from "mongoose";
import { Field, ID, Int, ObjectType, registerEnumType } from "type-graphql";
import { Student } from "./student";
import { TimeScalar } from "./hourSchema";
import { Institution } from "./Institution";
import { ObjectId } from "mongodb";
import { School } from "./schoolSchema";
import { User } from "./user";

export enum StudentVoyegeEnum {
  notHere = "NOT_HERE",
  here = "HERE",
  gotOff = "GOT_OFF",
}

registerEnumType(StudentVoyegeEnum, {
  name: "StudentVoyegeEnum",
});

@ObjectType()
export class StudentVoyegeInfo {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => ID)
  studentId: Student["_id"];

  @Field(() => Student, { nullable: true })
  student?: Student;

  @Field(() => StudentVoyegeEnum)
  status: StudentVoyegeEnum;

  @Field(() => Int)
  order: number;

  @Field({ nullable: true })
  disabled?: boolean;
}

export interface IStudentVoyegeInfo extends StudentVoyegeInfo, Document {
  _id: ObjectId;
}
const StudentVoyageInfoSchema = new Schema<IStudentVoyegeInfo>({
  studentId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: Schema.Types.String,
    required: true,
    default: StudentVoyegeEnum.notHere,
    enum: Object.values(StudentVoyegeEnum),
  },
  order: {
    type: Schema.Types.Number,
    required: true,
    default: 0,
  },
  disabled: {
    type: Schema.Types.Boolean,
    required: false,
  },
});
@ObjectType()
export class VoyageTime {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => Int)
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  @Field(() => TimeScalar)
  hour: Date;

  @Field(() => [StudentVoyegeInfo])
  studentInfos: StudentVoyegeInfo[];

  @Field({ nullable: true })
  isStart?: boolean;

  @Field(() => ID, { nullable: true })
  sessionId?: ObjectId;

  @Field()
  isTakeSchool: boolean;
}

interface IVoyageTime extends VoyageTime, Document {
  _id: ObjectId;
  studentInfos: Types.DocumentArray<IStudentVoyegeInfo>;
}
const voyageTimeSchema = new Schema<IVoyageTime>({
  day: {
    type: Schema.Types.Number,
    required: true,
    min: 0,
    max: 6,
  },
  hour: {
    type: Schema.Types.Date,
    required: true,
  },
  sessionId: {
    type: Schema.Types.ObjectId,
  },
  isStart: {
    type: Schema.Types.Boolean,
    required: true,
    default: false,
  },
  isTakeSchool: { type: Schema.Types.Boolean, required: true },
  studentInfos: [StudentVoyageInfoSchema],
});

@ObjectType()
export class Voyage {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => ID)
  driverId: User["_id"];

  @Field(() => [VoyageTime])
  voyageTimes: VoyageTime[];

  @Field()
  title: string;

  @Field(() => ID)
  schoolId: School["_id"];

  @Field(() => School, { nullable: true })
  readonly school?: School;

  @Field({ nullable: true })
  readonly institutionName?: string;

  @Field(() => [ID])
  studentIds: Types.ObjectId[];

  @Field(() => ID)
  institutionId: Institution["_id"];
}

export interface IVoyage extends Voyage, Document {
  _id: ObjectId;
  voyageTimes: Types.DocumentArray<IVoyageTime>;
}
const voyageSchema = new Schema<IVoyage>({
  driverId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: Schema.Types.String,
    required: true,
    maxlength: 100,
  },
  voyageTimes: [voyageTimeSchema],
  institutionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  studentIds: {
    type: [Schema.Types.ObjectId],
  },
  schoolId: {
    type: Schema.Types.ObjectId,
  },
});

export const VoyageModel = model<IVoyage>("Voyage", voyageSchema);
