import { Schema, Document, Types, model } from "mongoose";
import { Field, ObjectType, Int, ID } from "type-graphql";
import { ObjectId } from "mongodb";

@ObjectType()
export class ClubG {
  @Field(() => ID)
  _id: ObjectId = new ObjectId();

  @Field()
  name: string;
}
export interface IClubG extends ClubG, Document {
  _id: ObjectId;
}

const clubSchema = new Schema<IClubG>({
  name: {
    type: String,
    required: false,
  },
});
export const ClubModel = model<IClubG>("ClubG", clubSchema);
