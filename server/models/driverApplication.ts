/* eslint-disable no-unused-vars */
import { Schema } from "mongoose";
import { ObjectType } from "type-graphql";
import { ApplicationModel, IApplication } from "./application";
import { Application } from "./application";

@ObjectType()
export class DriverApplication extends Application {}

export interface IDriverApplication extends IApplication {}
const driverApplicationSchema = new Schema<IDriverApplication>({});

export const DriverApplicationModel = ApplicationModel.discriminator<
  IDriverApplication
>("DriverApplication", driverApplicationSchema);
