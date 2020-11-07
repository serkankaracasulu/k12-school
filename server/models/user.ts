import { Schema, model, Document } from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Field, ObjectType, Int, ID } from "type-graphql";
import { Types } from "mongoose";
import { LessonG } from "./lessonGModel";
import { SchoolG } from "./schoolGModel";
import { Institution } from "./Institution";
import { Person, IPerson, PersonModel, Role } from "./person";
import { Education, IEducation, educationSchema } from "./education";
import { ObjectId } from "mongodb";
import { ParentStudent, IParentStudent, parentStudentSchema } from "./parent";
import { Driver, IDriver, driverSchema } from "./driver";
import { Teacher, teacherSchema } from "./teacher";
import { IActiveUser } from "../types";

@ObjectType()
class UserNotification {
  @Field(() => ID)
  _id: ObjectId;

  @Field()
  title: string;

  @Field({ nullable: true })
  link?: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  notificationType?: string;
}

interface INotification extends Document, UserNotification {
  _id: ObjectId;
}
const notification = new Schema<INotification>({
  title: { type: String, required: true, min: 5, max: 500 },
  link: { type: String, min: 5, max: 200 },
  createdAt: { type: Date, default: Date.now },
  notificationType: { type: String },
});

@ObjectType()
export class IlIlce {
  @Field(() => ID)
  _id: Document["_id"];

  @Field(() => Int)
  ilId: number;

  @Field()
  il: string;

  @Field()
  ilce: string;
}

const ilIlceSchema = new Schema({
  ilId: {
    type: Number,
    min: 1,
    max: 81,
    required: true,
  },
  il: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  ilce: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
});

export class TeacherLessonCV {
  _id: Document["_id"];
  lessonId: LessonG["_id"];
  schoolKindId?: SchoolG["_id"];
  weeklyHour: number;
  days: number;
}
export interface ITeacherLessonCV extends TeacherLessonCV, Document {}

const teacherLessonSchema = new Schema({
  lessonId: {
    type: Types.ObjectId,
    required: true,
    ref: "Lesson",
  },
  schoolKindId: {
    type: Types.ObjectId,
    required: false,
    ref: "School",
  },
  weeklyHour: {
    type: Number,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
});
export class TeacherPreviousJob {
  institutionId: Institution["_id"];
  lessons: TeacherLessonCV[];
}
export interface ITeacherPreviousJob extends TeacherPreviousJob, Document {
  lessons: Types.DocumentArray<ITeacherLessonCV>;
}
const TeacherPreviousJobSchema = new Schema({
  institutionId: {
    type: Types.ObjectId,
    required: true,
    ref: "Institution",
  },
  lessons: [teacherLessonSchema],
});

@ObjectType()
export class User extends Person {
  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    super(firstName, lastName);
    this.email = email;
    this.password = password;
  }
  @Field(() => [Education])
  educations: Education[];

  @Field()
  email: string;

  @Field(() => [UserNotification])
  notifications: UserNotification[];

  @Field(() => Teacher, { nullable: true })
  teacher?: Teacher;

  @Field(() => [ParentStudent])
  parentStudents: ParentStudent[];

  @Field(() => Driver, { nullable: true })
  driver?: Driver;
}
export interface IUser extends IPerson, User {
  email: string;
  studentIds: any;
  resetPasswordToken?: string;
  educations: Types.DocumentArray<IEducation>;
  notifications: Types.DocumentArray<INotification>;
  previousJobs: Types.DocumentArray<ITeacherPreviousJob>;
  driver?: IDriver;
}
const userSchema = new Schema<IUser>(
  {
    superAdmin: {
      type: Boolean,
      default: false,
    },
    address: ilIlceSchema,
    previousJobs: [TeacherPreviousJobSchema],
    educations: [educationSchema],
    notifications: [notification],
    driver: driverSchema,
    parentStudents: [parentStudentSchema],
    teacher: teacherSchema,
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const roles: Role[] = [Role.USER];
  const activeUser: IActiveUser = {
    _id: this.id,
    email: this.email,
    roles,
    fullName: this.firstName + " " + this.lastName,
    parentStudents: [],
  };
  if (this.driver) {
    activeUser.driver = this.driver.institutions.map((i) => {
      return {
        institutionId: i.institutionId.toHexString(),
        studentIds: i.studentIds.map((s) => s.toHexString()),
      };
    });
    activeUser.roles.push(Role.DRIVER);
  }
  if (this.parentStudents.length > 0) {
    for (const ps of this.parentStudents) {
      activeUser.parentStudents.push({
        id: ps._id.toHexString(),
        institutionId: ps.institutionId.toHexString(),
        studentId: ps.studentId.toHexString(),
      });
    }
    activeUser.roles.push(Role.PARENT);
  }
  if (this.teacher) {
    activeUser.teacher = {
      schoolIds: this.teacher.schoolIds.map((s) => s.toHexString()),
      institutionId: this.teacher.institutionId.toHexString(),
      allSchool: this.teacher.allSchool,
    };
    if (this.teacher.owner) roles.push(Role.OWNER);
    roles.push(Role.TEACHER);
  }
  if (this.superAdmin === true) roles.push(Role.SUPER_ADMIN);
  if (typeof process.env.SECRET_KEY === "string") {
    return jwt.sign(activeUser, process.env.SECRET_KEY, { expiresIn: "3h" });
  }
};

export const UserModel = PersonModel.discriminator<IUser>("User", userSchema);

export class Token {
  constructor(userId: ObjectId) {
    this._userId = userId;
  }
  _userId: ObjectId | IUser;
  token: string = crypto.randomBytes(16).toString("hex");
  createdAt: Date = new Date(Date.now());
}
interface IToken extends Document, Token {}
const tokenSchema: Schema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
});
export const TokenModel = model<IToken>("Token", tokenSchema);
