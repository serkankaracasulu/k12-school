import { Schema, Document } from "mongoose";
import { Field, ObjectType, Int, ID } from "type-graphql";
import { IDepartment, Department } from "./department";
import { IUniversity, University } from "./university";
import { ObjectId } from "mongodb";

@ObjectType()
export class Education {
  @Field(() => ID)
  _id: ObjectId;

  @Field()
  educationLevelName: string;

  @Field(() => Int)
  educationLevel: number;

  @Field(() => Int)
  educationType: number;

  @Field()
  educationTypeName: string;

  @Field(() => Int)
  educationlanguage: number;

  @Field()
  educationlanguageName: string;

  @Field(() => University)
  readonly university?: University;

  @Field(() => ID)
  universityId: IUniversity["_id"];

  @Field({ nullable: true })
  universityName?: string;

  @Field(() => [String])
  readonly roles?: string[];

  @Field(() => ID)
  departmentId: IDepartment["_id"];

  @Field(() => Department, { nullable: true })
  readonly department?: Department;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  finishDate?: Date;
}

export interface IEducation extends Education, Document {
  _id: ObjectId;
}

export const educationSchema = new Schema<IEducation>({
  educationLevelName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  educationLevel: { type: Number, required: true, min: 0, max: 3 },
  educationType: { type: Number, required: true, min: 0, max: 1 },
  educationTypeName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  educationlanguage: {
    type: Number,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  educationlanguageName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  universityId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "University",
  },
  universityName: {
    type: String,
    minlength: 2,
    maxlength: 255,
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  finishDate: {
    type: Date,
  },
});
