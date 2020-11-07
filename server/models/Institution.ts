/* eslint-disable no-unused-vars */

import { Field, ObjectType, ID } from "type-graphql";
import { Schema, model, Document, Model } from "mongoose";
import Joi from "@hapi/joi";
import { schoolSchema, ISchool, School } from "./schoolSchema";
import { IUser } from "./user";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";

@ObjectType()
export class Institution {
  @Field(() => ID)
  _id: ObjectId;

  @Field()
  name: string;

  @Field(() => [School])
  schools: School[];

  creator: IUser["_id"];
}
export interface IInstitution extends Document, Institution {
  schools: Types.DocumentArray<ISchool>;
  _id: ObjectId;
}

const institutionSchema: Schema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
      required: true,
      unique: true,
    },
    schools: [schoolSchema],
  },
  { timestamps: true }
);

export const InstitutionModel: Model<IInstitution> = model<IInstitution>(
  "Institution",
  institutionSchema
);
