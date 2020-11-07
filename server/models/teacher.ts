import { Field, ObjectType, ID, registerEnumType } from "type-graphql";
import { Schema, Document } from "mongoose";
import { Institution } from "./Institution";
import { ObjectId } from "mongodb";

@ObjectType()
export class Teacher {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => ID)
  institutionId: Institution["_id"];

  @Field()
  allSchool: boolean;

  @Field(() => ID)
  schoolIds: ObjectId[];

  @Field(() => ID, { nullable: true })
  addedById?: ObjectId;

  owner: boolean;
}
export interface ITeacher extends Teacher, Document {
  _id: ObjectId;
}

export const teacherSchema = new Schema<ITeacher>({
  allSchool: {
    type: Schema.Types.Boolean,
    default: true,
  },
  institutionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Institution",
  },
  schoolIds: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
  addedById: Schema.Types.ObjectId,
  owner: Schema.Types.Boolean,
});
