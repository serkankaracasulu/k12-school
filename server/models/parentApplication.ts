/* eslint-disable no-unused-vars */
import { Schema, Document } from "mongoose";
import { Field, ObjectType, ID } from "type-graphql";
import { ApplicationModel, IApplication } from "./application";
import { Application } from "./application";
import { ObjectId } from "mongodb";
import { Student } from "./student";

@ObjectType()
export class ParentApplication extends Application {
  @Field(() => ID)
  studentId: Student["_id"];
}

export interface IParentApplication extends ParentApplication, IApplication {
  _id: ObjectId;
  studentId: Student["_id"];
}
const parentApplicationSchema = new Schema<IParentApplication>({
  studentId: { type: Schema.Types.ObjectId, required: true },
});

export const ParentApplicationModel = ApplicationModel.discriminator<
  IParentApplication
>("ParentApplication", parentApplicationSchema);
