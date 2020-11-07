import { Schema, model, Document } from "mongoose";
import Joi from "@hapi/joi";
import { Field, ObjectType, ID } from "type-graphql";
import { ObjectId } from "mongodb";

@ObjectType()
export class Department {
  @Field(() => ID)
  _id: ObjectId;

  @Field()
  name: string;
}

export interface IDepartment extends Document, Department {
  _id: ObjectId;
}
const universityDepartmentSchema: Schema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
  },
  { timestamps: true }
);

export const DepartmentModel = model<IDepartment>(
  "Department",
  universityDepartmentSchema
);
