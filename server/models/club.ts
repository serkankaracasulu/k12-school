import { Schema, Document } from "mongoose";
import { Field, ObjectType, ID } from "type-graphql";
import { ClubG } from "./clubG";
import { LessonBase, LessonBaseModel, ILessonBase } from "./lessonSchema";

@ObjectType()
export class Club extends LessonBase {
  @Field(() => ID, { nullable: true })
  clubId?: ClubG["_id"];

  @Field(() => String)
  readonly clubName: ClubG["name"];
}
export interface IClub extends Club, ILessonBase {}

const clubSchema = new Schema<IClub>({
  clubId: {
    type: Schema.Types.ObjectId,
    required: false,
  },
});
export const ClubModel = LessonBaseModel.discriminator<IClub>(
  "Club",
  clubSchema
);
