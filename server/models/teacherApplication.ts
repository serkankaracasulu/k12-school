/* eslint-disable no-unused-vars */
import { Schema } from "mongoose";
import Joi from "@hapi/joi";
import { ObjectType } from "type-graphql";
import { ApplicationModel, IApplication } from "./application";
import { Application } from "./application";

@ObjectType()
export class TeacherApplication extends Application {}

export interface ITeacherApplication extends IApplication {}
const teacherApplicationSchema = new Schema<ITeacherApplication>({});
export const TeacherApplicationModel = ApplicationModel.discriminator<
  ITeacherApplication
>("TeacherApplication", teacherApplicationSchema);
