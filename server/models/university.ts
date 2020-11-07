/* eslint-disable no-unused-vars */

import { Schema, model, Document } from "mongoose";
import { Field, ObjectType, ID } from "type-graphql";
import { ObjectId } from "mongodb";

@ObjectType()
export class University {
  @Field(() => ID)
  _id: ObjectId;

  @Field()
  name: string;

  @Field({ nullable: true })
  universityLogoUrl?: string;
}

export interface IUniversity extends Document, University {
  _id: ObjectId;
}
const universitySchema: Schema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    universityLogoUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export const UniversityModel = model<IUniversity>(
  "University",
  universitySchema
);
