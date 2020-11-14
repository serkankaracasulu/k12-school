import { Kind } from "graphql/language/kinds";
import { GraphQLScalarType } from "graphql/type/definition";
import { ObjectId, Decimal128 } from "mongodb";
import { Document, model, Schema, Types } from "mongoose";
import { Field, ID, Int, ObjectType } from "type-graphql";

import { Voyage, VoyageTime } from "./voyage";

export const Decimal128Scalar = new GraphQLScalarType({
  name: "Decimal128",
  description: "Decimal128 for bson",
  parseValue(value: number) {
    return value; // value from the client input variables
  },
  serialize(value: Decimal128) {
    return +value.toString(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.FLOAT) {
      return ast.value; // value from the client query
    }
    return null;
  },
});

@ObjectType()
export class Point {
  constructor(latitude: number, longitude: number) {
    this.coordinates = [latitude, longitude];
  }
  type: "Point" = "Point";

  @Field(() => [Decimal128Scalar])
  coordinates: [number, number];
}
export interface IPoint extends Point, Document {}
@ObjectType()
export class CoordinatesType implements Partial<Coordinates> {
  @Field()
  accuracy: number;

  @Field(() => Int, { nullable: true })
  altitude: number | null;

  @Field(() => Int, { nullable: true })
  altitudeAccuracy: number | null;

  @Field(() => Int, { nullable: true })
  heading: number | null;

  @Field(() => Point)
  point: Point;

  @Field(() => Int, { nullable: true })
  speed: number | null;
}

const PointSchema = new Schema<IPoint>({
  type: {
    type: Schema.Types.String,
    default: "Point",
  },
  coordinates: {
    type: [Schema.Types.Decimal128],
    minlength: 2,
    MaxLength: 2,
    required: true,
  },
});
export interface ICoordinatesType extends CoordinatesType, Document {}

const CoordinatesTypeSchema = new Schema<ICoordinatesType>({
  accuracy: { type: Schema.Types.Number, required: true },
  altitude: Schema.Types.Number,
  altitudeAccuracy: Schema.Types.Number,
  heading: Schema.Types.Number,
  point: PointSchema,
  speed: Schema.Types.Number,
});

@ObjectType()
export class PositionType {
  @Field(() => CoordinatesType)
  coords: CoordinatesType;

  @Field(() => Date)
  timestamp: Date;
}

/*
  @Field(() => ObjectIdScalar)
  driverId: ObjectId;
  @Field(() => ObjectIdScalar)
  voyageId: ObjectId;
  @Field(() => ObjectIdScalar)
  timeId: ObjectId;
  */

export interface IPositionType extends PositionType, Document {}

@ObjectType()
export class VoyagePosition {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => ID)
  driverId: ObjectId;

  @Field(() => ID)
  voyageId: Voyage["_id"];

  @Field(() => ID)
  sessionId: ObjectId;

  @Field(() => ID)
  voyageTimeId: VoyageTime["_id"];

  @Field(() => [PositionType])
  positions: PositionType[];

  @Field()
  createdAt: Date;
}

const PositionTypeSchema = new Schema<IPositionType>({
  timestamp: {
    type: Schema.Types.Date,
    required: true,
  },
  coords: CoordinatesTypeSchema,
});

export interface IVoyagePosition extends VoyagePosition, Document {
  positions: Types.DocumentArray<IPositionType>;
  _id: ObjectId;
}
export const VoyagePositionSchema = new Schema<IVoyagePosition>({
  driverId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  voyageId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  voyageTimeId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  sessionId: {
    type: Schema.Types.ObjectId,
    required: true,
    default: new ObjectId(),
  },
  positions: [PositionTypeSchema],
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: "1d" },
  },
});
export const VoyagePositionModel = model<IVoyagePosition>(
  "VoyagePosition",
  VoyagePositionSchema
);
