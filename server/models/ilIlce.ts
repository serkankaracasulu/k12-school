import { Schema, model, Document } from "mongoose";
import { Field, ObjectType, Int, ID } from "type-graphql";
import { ObjectId } from "mongodb";

@ObjectType()
export class Il {
  @Field(() => ID)
  _id: ObjectId;

  @Field()
  il: string;

  @Field(() => [String])
  ilceleri: string[];
}

export interface IIl extends Document, Il {
  _id: ObjectId;
}
const ilIlceSchema: Schema = new Schema({
  il: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 250,
    index: true,
  },
  ilceleri: [{ type: String, index: true }],
});
export const IlModel = model<IIl>("Il", ilIlceSchema);
