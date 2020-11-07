/* eslint-disable no-unused-vars */

import { Schema, Types } from "mongoose";
import jwt from "jsonwebtoken";
import {
  notificationSchema,
  Notification,
  INotification,
} from "./studentNotification";
import { ISchool } from "./schoolSchema";
import { IClass } from "./classSchema";
import { Field, ObjectType, ID } from "type-graphql";
import { IActiveUser } from "./../types";
import { Role } from "./person";
import { Person, IPerson, PersonModel } from "./person";
import generatePassword from "../helper/generatePassword";
import { ObjectId } from "mongodb";

@ObjectType()
export class Student extends Person {
  constructor(
    institution: ObjectId,
    firstName: string,
    lastName: string,
    citizenshipId: string,
    schoolId?: ObjectId,
    classId?: ObjectId
  ) {
    super(firstName, lastName);
    this.institutionId = institution;
    this.citizenshipId = citizenshipId;
    this.school = schoolId;
    this.class = classId;
  }

  @Field(() => [Notification])
  notifications: Notification[];

  @Field()
  citizenshipId: string;

  @Field()
  username: string;

  @Field(() => ID, { nullable: true })
  school?: ISchool["_id"];

  @Field({ nullable: true })
  foreignLanguage?: string;

  @Field({ nullable: true })
  schoolNo?: string;

  @Field(() => ID, { nullable: true })
  class?: IClass["_id"];

  @Field({ nullable: true })
  readonly schoolName?: string;

  @Field({ nullable: true })
  readonly className?: string;
  institutionId: ObjectId;
  password = generatePassword();
}
@ObjectType()
export class StudentPassword {
  @Field()
  password: string;
}
export interface IStudent extends Student, IPerson {
  institutionId: ObjectId;
  citizenshipId: string;
  institution?: undefined;
  notifications: Types.DocumentArray<INotification>;
  passwordEqualAsync(password: string): Promise<boolean>;
  generateAuthToken(): string | undefined;
}

const studentSchema = new Schema<IStudent>({
  username: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 255,
    required: true,
    sparse: true,
  },
  notifications: [notificationSchema],
  school: {
    type: Schema.Types.ObjectId,
  },
  foreignLanguage: {
    type: String,
    minlength: 3,
    maxlength: 255,
  },
  schoolNo: {
    type: String,
    minlength: 1,
    maxlength: 55,
  },
  class: {
    type: Schema.Types.ObjectId,
  },
  institutionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

studentSchema.index({ institutionId: 1, school: 1, class: 1 });
studentSchema.index({ citizenshipId: 1, institutionId: 1 }, { unique: true });
/*
studentSchema.index(
  { firstName: "text", lastName: "text" },
  {
    weights: { firstName: 1, lastname: 2 },
    default_language: "turkish",
    background: true,
  }
);
*/
studentSchema.methods.generateAuthToken = function () {
  let roles = [Role.STUDENT, Role.USER];
  if (typeof process.env.SECRET_KEY === "string") {
    const activeUser: IActiveUser = {
      _id: this.id,
      roles,
      student: {
        institutionId: this.institutionId.toHexString(),
        schoolId: this.school?.toHexString(),
        classId: this.class?.toHexString(),
      },
      fullName: this.firstName + " " + this.lastName,
      parentStudents: [],
    };
    return jwt.sign(activeUser, process.env.SECRET_KEY, { expiresIn: "2h" });
  }
};

export const StudentModel = PersonModel.discriminator<IStudent>(
  "Student",
  studentSchema
);
