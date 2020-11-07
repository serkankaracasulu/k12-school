/* eslint-disable no-unused-vars */

import { Schema, model, Document } from "mongoose";
import { IInstitution } from "./Institution";
import { IUser } from "./user";
import { Field, ObjectType, Int, ID } from "type-graphql";
import mailTransporter from "../helper/mailTransporter";
import url from "url";
import jwt from "jsonwebtoken";
import path from "path";
import * as querystring from "querystring";
import { Role } from "./person";
import { ObjectId } from "mongodb";
@ObjectType()
export class Application {
  @Field(() => ID)
  _id: ObjectId;

  @Field()
  email?: string;

  @Field(() => ID, { nullable: true })
  userId?: IUser["_id"];

  @Field(() => Int)
  status: number;

  @Field(() => ID)
  institutionId: IInstitution["_id"];

  @Field(() => ID, { nullable: true })
  readonly studentId?: ObjectId;

  @Field({ nullable: true })
  readonly studentFullName?: string;

  @Field()
  readonly createdAt: Date;

  @Field({ nullable: true })
  readonly institutionName?: string;

  @Field({ nullable: true })
  readonly userFullName?: string;
}

export interface IApplication extends Document, Application {
  _id: ObjectId;
  kind: string;
  sendInvatation(): Promise<void>;
}
const applicationSchema = new Schema<IApplication>(
  {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Person",
      index: true,
    },
    status: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 3,
    },
    institutionId: {
      type: Schema.Types.ObjectId,
      ref: "Institution",
      index: true,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    studentId: {
      type: Schema.Types.ObjectId,
    },
  },
  { discriminatorKey: "kind" }
);
applicationSchema.methods.sendInvatation = async function () {
  if (typeof process.env.SECRET_KEY === "string") {
    const transporter = mailTransporter();
    if (!transporter) return;
    const token = jwt.sign(
      {
        _id: this._id,
        userType:
          this.kind === "DriverApplication"
            ? Role.DRIVER
            : "ParentApplication"
            ? Role.PARENT
            : Role.TEACHER,
      },
      process.env.SECRET_KEY
    );
    if (!this.userId && this.email) {
      const queryString = querystring.stringify({
        token,
        email: this.email,
      });
      const link = url.resolve(
        "http://localhost:3000",
        path.join("signup", `?${queryString}`)
      );
      transporter.sendMail({
        from: process.env.MAILER_EMAIL_ID,
        to: this.email,
        subject: "Hesap oluşturma isteği",
        html: link,
      });
    } else {
      transporter.sendMail({
        from: process.env.MAILER_EMAIL_ID,
        to: this.email,
        subject: "Hesap oluşturma isteği",
        html: `${this.institutionName}`,
      });
    }
  }
};
applicationSchema.index(
  { institutionId: 1, email: 1, kind: 1 },
  { unique: true, partialFilterExpression: { email: { $exists: true } } }
);
export const ApplicationModel = model<IApplication>(
  "Application",
  applicationSchema
);
