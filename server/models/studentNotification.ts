/* eslint-disable no-unused-vars */

import Joi from "@hapi/joi";
import { Schema, model, Document } from "mongoose";
import { ILesson } from "./lessonSchema";
import { Field, ObjectType, Int, ID, registerEnumType } from "type-graphql";
import { IInstitution } from "./Institution";
import { School } from "./schoolSchema";
import { ClassType } from "./classSchema";
import { Student } from "./student";
import { Person } from "./person";
import { ObjectId } from "mongodb";

export enum StudentNotificationState {
  Read = "Read",
  Seen = "Seen",
  Unread = "Unread",
}
registerEnumType(StudentNotificationState, {
  name: "StudentNotificationState",
});

export enum StudentNotificationAction {
  Insert = "Inset",
  Delete = "Delete",
  Update = "Update",
}
registerEnumType(StudentNotificationAction, {
  name: "StudentNotificationAction",
});
export enum StudentNotificationType {
  announcement = "announcement",
  homework = "homework",
  exam = "exam",
  absence = "absence",
}
registerEnumType(StudentNotificationType, {
  name: "StudentNotificationType",
});
@ObjectType()
export class Notification {
  constructor(
    personId: ObjectId,
    notificationType: StudentNotificationType,
    lessonId?: ObjectId
  ) {
    this.personId = personId;
    this.lessonId = lessonId;
    this.notificationType = notificationType;
  }
  @Field(() => ID)
  _id: ObjectId = new ObjectId();

  @Field(() => StudentNotificationState)
  state: StudentNotificationState = StudentNotificationState.Unread;

  @Field(() => ID, { nullable: true })
  lessonId?: ILesson["_id"];

  @Field(() => StudentNotificationType)
  notificationType: StudentNotificationType;

  @Field({ nullable: true })
  lessonName?: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => StudentNotificationAction)
  action: StudentNotificationAction = StudentNotificationAction.Insert;

  @Field()
  createdAt: Date = new Date(Date.now());

  @Field(() => ID, { nullable: true })
  targetId?: ObjectId;

  personId: Person["_id"];
}
export interface NotificationPalyload extends Notification {
  institutionId: IInstitution["_id"];
  schoolId: School["_id"];
  classId: ClassType["_id"];
  studentId?: Student["_id"];
}

export interface INotification extends Document, Notification {
  _id: ObjectId;
}
export const notificationSchema: Schema = new Schema({
  state: {
    type: String,
    enum: Object.values(StudentNotificationState),
    default: Object.values(StudentNotificationState)[0],
    required: true,
  },
  lessonId: {
    type: Schema.Types.ObjectId,
  },
  action: {
    type: String,
    required: true,
    enum: Object.values(StudentNotificationAction),
  },
  notificationType: {
    type: String,
    required: true,
    enum: Object.values(StudentNotificationType),
  },
  lessonName: {
    type: String,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  targetId: {
    type: Schema.Types.ObjectId,
  },
  personId: {
    type: Schema.Types.ObjectId,
    ref: "Person",
  },
});

export const StudentNotificationModel = model<INotification>(
  "StudentNotification",
  notificationSchema
);
