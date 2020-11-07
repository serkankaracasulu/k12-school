import { Field, ObjectType, Int, ID, registerEnumType } from "type-graphql";
import { Schema, model, Document, Types } from "mongoose";
import { LessonG } from "./lessonGModel";
import { Student } from "./student";
import { Institution } from "./Institution";
import { ClassType } from "./classSchema";
import { Person } from "./person";
import { ObjectId } from "mongodb";
import { User } from "./user";
import { TimeScalar } from "./hourSchema";

export enum StudyState {
  Read = "Read",
  Seen = "Seen",
  Unread = "Unread",
}
registerEnumType(StudyState, {
  name: "StudyState",
});

export enum StudyStudentStatus {
  Teacher = "Teacher",
  Student = "Student",
  Accept = "Accept",
  NotJoined = "NotJoined",
}
registerEnumType(StudyStudentStatus, {
  name: "StudyStudentStatus",
});

@ObjectType()
export class StudyStudent {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => ID)
  studentId: Student["_id"];

  @Field(() => StudyStudentStatus)
  status: StudyStudentStatus;

  @Field(() => StudyState)
  state: StudyState;

  @Field(() => Person, { nullable: true })
  readonly student?: Person;
}
export interface IStudyStudent extends StudyStudent, Document {
  _id: ObjectId;
}

@ObjectType()
export class Study {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => ID)
  teacherId: User["_id"];

  @Field(() => ID, { nullable: true })
  lessonId?: LessonG["_id"];

  @Field(() => [StudyStudent])
  students: StudyStudent[];

  @Field()
  date: Date;

  @Field(() => Int)
  duration: number;

  @Field()
  subject: string;

  @Field({ nullable: true })
  detail?: string;

  @Field(() => ID)
  institutionId: Institution["_id"];

  @Field()
  public: boolean = false;

  @Field(() => Int, { nullable: true })
  capacity?: number;

  @Field(() => TimeScalar)
  dateTimeSpan?: Date;

  @Field(() => [ID], { nullable: true })
  permissionClasses?: ClassType["_id"][];

  @Field()
  readonly lessonName?: string;
}

const studyStudentSchema: Schema<IStudyStudent> = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Student",
  },
  status: {
    type: String,
    enum: Object.values(StudyStudentStatus),
    default: StudyStudentStatus.Student,
    required: true,
  },
  state: {
    type: String,
    enum: Object.values(StudyState),
    default: StudyState.Unread,
    required: true,
  },
});
export interface IStudy extends Study, Document {
  _id: ObjectId;
  students: Types.DocumentArray<IStudyStudent>;
  isCapacityFull(): boolean;
  isPermissionClass(classId: string): boolean;
}
const studySchema = new Schema<IStudy>({
  teacherId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "User",
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
  },
  students: [studyStudentSchema],
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    minlength: 2,
    maxlength: 70,
    required: true,
  },
  detail: {
    type: String,
    minlength: 2,
    maxlength: 280,
    required: false,
  },
  institutionId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "Institution",
  },
  public: {
    type: Boolean,
    default: true,
    required: true,
  },
  capacity: {
    type: Number,
    min: 0,
  },
  permissionClasses: {
    type: [Schema.Types.ObjectId],
  },
});
studySchema.index({ date: 1, institutionId: 1 });
studySchema.methods.isCapacityFull = function () {
  return !(this.capacity !== undefined && this.capacity > this.students.length);
};
studySchema.virtual("dateTimeSpan").get(function (this: IStudy) {
  return this.date;
});
studySchema.methods.isPermissionClass = function (classId: string) {
  return (
    this.permissionClasses !== undefined &&
    this.permissionClasses.includes(Types.ObjectId(classId))
  );
};
export const StudyModel = model<IStudy>("Study", studySchema);
