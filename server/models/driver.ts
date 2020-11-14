import { ObjectType, Field, ID } from "type-graphql";
import { Schema, Types, Document } from "mongoose";
import { DriverStudentApplication } from "./driverStudentApplication";
import { ObjectId } from "mongodb";

@ObjectType()
export class DriverInstitution {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => ID)
  institutionId: Types.ObjectId;

  @Field({ nullable: true })
  readonly institutionName?: string;

  studentIds: Types.ObjectId[];
}
export interface IDriverInstitution extends DriverInstitution, Document {
  _id: ObjectId;
}

@ObjectType()
export class Driver {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => DriverStudentApplication, { nullable: true })
  readonly requestApp?: DriverStudentApplication;
  @Field(() => [DriverInstitution])
  institutions: DriverInstitution[];
}

export interface IDriver extends Driver, Document {
  _id: ObjectId;
  institutions: Types.DocumentArray<IDriverInstitution>;
}
const driverInstitutionSchema = new Schema<IDriverInstitution>({
  institutionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  studentIds: [Schema.Types.ObjectId],
});

export const driverSchema = new Schema<IDriver>({
  institutions: [driverInstitutionSchema],
});
/*
driverSchema.methods.generateAuthToken = function () {
  const roles: Role[] = [Role.USER, Role.DRIVER];
  if (typeof process.env.SECRET_KEY === "string") {
    const activeUser: IActiveUser = {
      _id: this.id,
      email: this.email,
      roles,
      institution: this.institutionId?.toHexString(),
      fullName: this.firstName + " " + this.lastName,
      institutions: this.institutions.map((e) => {
        return {
          institutionId: e.institutionId.toHexString(),
          studentIds: e.studentIds.map((s) => s.toHexString()),
        };
      }),
    };
    return jwt.sign(activeUser, process.env.SECRET_KEY);
  }
};

export const DriverModel = PersonModel.discriminator<IDriver>(
  "Driver",
  driverSchema
);
*/
