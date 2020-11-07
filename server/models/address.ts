import { Types, Schema, Document } from "mongoose";
import { ObjectType, Field, ID, Float } from "type-graphql";
import { School } from "./schoolSchema";

@ObjectType()
export class AddressLocation {
  type: "Point";

  @Field(() => [Float!]!)
  coordinates: [number, number];
}

export interface IAddressLocation extends AddressLocation, Document {}

export const addressLocationSchema = new Schema<IAddressLocation>({
  type: {
    type: Schema.Types.String,
    enum: ["Point"],
    default: "Point",
    required: true,
  },
  coordinates: {
    type: [Schema.Types.Number],
    required: true,
  },
});

@ObjectType()
export class Address {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => AddressLocation)
  location: AddressLocation;
}
export interface IAddress extends Address, Document {
  _id: Types.ObjectId;
}

export const addressSchema = new Schema<IAddress>({
  title: {
    type: Schema.Types.String,
    required: true,
  },
  description: {
    type: Schema.Types.String,
    required: true,
  },
  location: addressLocationSchema,
});

export class InstitutionAddress extends Address {
  @Field(() => ID)
  schoolId: School["_id"];
}

class PersonAddress extends Address {}
