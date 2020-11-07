/* eslint-disable no-unused-vars */
import { Schema } from "mongoose";
import { ObjectType, Field, ID } from "type-graphql";
import { ApplicationModel, IApplication } from "./application";
import { Application } from "./application";
import { Driver } from "./driver";
import { Student } from "./student";
import { Address } from "./address";
import { ObjectId } from "mongodb";

@ObjectType()
export class DriverStudentApplication extends Application {
  driverId: Driver["_id"];
  userId: Student["_id"];

  @Field(() => Address, { nullable: true })
  address?: Address;

  @Field({ nullable: true })
  readonly institutionName?: string;

  @Field(() => ID)
  parentId: ObjectId;
}

export interface IDriverStudentApplication
  extends DriverStudentApplication,
    IApplication {
  email: undefined;
  userId: Student["_id"];
}
const driverStudentApplicationSchema = new Schema<IDriverStudentApplication>({
  driverId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
});
driverStudentApplicationSchema.index(
  { driverId: 1, userId: 1 },
  { unique: true }
);
export const DriverStudentApplicationModel = ApplicationModel.discriminator<
  IDriverStudentApplication
>("DriverStudentApplication", driverStudentApplicationSchema);
