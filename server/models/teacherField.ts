import { Schema, model, Document } from "mongoose";
import Joi from "@hapi/joi";
import { IDepartment, Department } from "./department";
import { Field, ObjectType, Int, ID } from "type-graphql";
import { ObjectId } from "mongodb";

@ObjectType()
export class TeacherField {
  @Field(() => ID)
  _id: ObjectId;

  @Field()
  name: string;

  @Field(() => [Department])
  readonly departments: Department[];

  departmentIds: IDepartment["_id"][];
}

export interface ITeacherField extends Document, TeacherField {
  _id: ObjectId;
}
const teacherFieldSchema = new Schema<ITeacherField>(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 255,
      unique: true,
    },
    departmentIds: [{ type: Schema.Types.ObjectId, ref: "Department" }],
  },
  { timestamps: true }
);
export const TeacherFieldModel = model<ITeacherField>(
  "TeacherField",
  teacherFieldSchema
);
