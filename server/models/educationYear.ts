/* eslint-disable no-unused-vars */
import { Field, ObjectType, ID } from "type-graphql";
import { Schema, Document, Types } from "mongoose";
import { ObjectId } from "mongodb";

@ObjectType()
export class Term {
  @Field(() => ID)
  _id: ObjectId;

  @Field()
  name: string;

  @Field()
  start: Date;

  @Field()
  finish: Date;
}

export interface ITerm extends Document, Term {
  _id: ObjectId;
}

@ObjectType()
export class EducationYear {
  @Field(() => ID)
  _id: ObjectId;

  @Field()
  name: string;

  @Field(() => [Term])
  terms: Term[];
}

export interface IEducationYear extends Document, EducationYear {
  terms: Types.DocumentArray<ITerm>;
  _id: ObjectId;
  /**
   *check if any term is up to date
   */
  isUpToDate(): boolean;
  getTermByDateRange(start: Date, end: Date): ITerm | undefined;
  getUpToDateTerm(): ITerm | undefined;
}

const termSchema = new Schema<ITerm>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
      reqired: true,
    },
    start: {
      type: Date,
      required: true,
    },
    finish: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const educationYearSchema = new Schema<IEducationYear>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
      reqired: true,
    },
    terms: [termSchema],
  },
  { timestamps: true }
);
educationYearSchema.methods.getTermByDateRange = function (
  start: Date,
  end: Date
) {
  return this.terms.find(
    (t) =>
      (t.start.valueOf() <= start.valueOf() &&
        t.finish.valueOf() >= start.valueOf()) ||
      (t.start.valueOf() <= end.valueOf() &&
        t.finish.valueOf() >= end.valueOf())
  );
};
educationYearSchema.methods.getUpToDateTerm = function () {
  const now = new Date(Date.now());
  return this.terms.find(
    (termValue) =>
      termValue.start.valueOf() < now.valueOf() &&
      termValue.finish.valueOf() > now.valueOf()
  );
};
educationYearSchema.methods.isUpToDate = function () {
  const now = new Date(Date.now());
  const mostLatestDate = new Date(
    Math.max.apply(
      null,
      this.terms.map(function (term) {
        return new Date(term.finish).valueOf();
      })
    )
  );
  if (mostLatestDate.valueOf() < now.valueOf()) return false;
  return true;
};
