import { Schema, model, Document, Types } from "mongoose";
import jwt from "jsonwebtoken";
import url from "url";
import bcrypt from "bcrypt";
import { Field, ObjectType, ID, registerEnumType } from "type-graphql";
import mailTransporter from "../helper/mailTransporter";
import * as querystring from "querystring";
import path from "path";
import { Token, TokenModel, IUser } from "./user";
import { logger } from "../startup/logging";
import { IInstitution } from "./Institution";
import { IActiveUser } from "../types";
import { Address, addressSchema } from "./address";
import { ObjectId } from "mongodb";
import { ITeacher } from "./teacher";
import { IStudent } from "./student";

export enum Role {
  USER = "USER",
  OWNER = "OWNER",
  TEACHER = "TEACHER",
  PARENT = "PARENT",
  ADMIN = "ADMIN",
  CLASSROOM_TEACHER = "CLASSROOM_TEACHER",
  SUPER_ADMIN = "SUPERADMIN",
  STUDENT = "STUDENT",
  DRIVER = "DRIVER",
}
registerEnumType(Role, {
  name: "Role",
});

class UserRole {
  role: Role;
  schoolId?: string;
  classId?: string;
  institutionId: string;
}

export enum PersonKind {
  user = "User",
  student = "Student",
  person = "Person",
}
registerEnumType(PersonKind, {
  name: "PersonKind",
});

interface IUserRole extends UserRole, Document {}

export class UserInstitution {
  constructor(role: Role) {
    this.role = role;
  }
  roles?: UserRole[];
  role: Role;
  readonly createdAt: Date;
}

const roleSchema = new Schema<UserRole>(
  {
    role: {
      type: String,
      enum: Object.values(Role),
    },
    schoolId: { type: Schema.Types.ObjectId },
    classId: { type: Schema.Types.ObjectId },
    institutionId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export interface IUserInstitution extends Document, UserInstitution {
  roles: IUserRole[];
}

const institutionSchema = new Schema<IUserInstitution>({
  roles: [roleSchema],
  role: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

@ObjectType()
export class Person {
  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  @Field(() => ID)
  _id: ObjectId = new ObjectId();

  @Field()
  firstName: string;

  @Field()
  readonly fullName?: string;

  lastLogin?: Date;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  birthDate?: Date;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  citizenshipId?: string;

  @Field({ nullable: true })
  unVerifiedEmail?: string;

  @Field({ nullable: true })
  profilePhoto?: boolean;

  @Field()
  readonly createdAt: Date;

  @Field(() => [Role])
  readonly roles: Role[] = [];

  isVerified?: boolean;

  @Field(() => Address, { nullable: true })
  address?: Address;

  @Field(() => PersonKind)
  kind: PersonKind;
  password: string;
}

export interface IPerson extends Person, Document {
  _id: ObjectId;
  superAdmin?: boolean;
  passwordEqualAsync(password: string): Promise<boolean>;
  generatePasswordResetToken(): string;
  sendConfirmEmail(): Promise<void>;
  verifyPasswordResetToken(token: string, id: ObjectId): string | object;
  getSecret(): string;
  sendForgotPassword(): Promise<boolean>;
  changePassword(password: string): Promise<boolean>;
  verified(): Promise<boolean>;
  updateLastLogin(): Promise<void>;
  generateAuthToken(): string | undefined;
}
export const personSchema = new Schema<IPerson>(
  {
    firstName: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true,
    },
    lastName: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      minlength: 5,
      maxlength: 255,
      sparse: true,
    },
    phone: {
      type: String,
      min: 5,
      max: 15,
      trim: true,
    },
    birthDate: {
      type: Date,
    },
    profilePhoto: {
      type: Boolean,
    },
    password: {
      type: Schema.Types.String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    citizenshipId: {
      type: String,
      minlength: 2,
      maxlength: 12,
    },
    lastLogin: { type: Date },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
    address: addressSchema,
  },
  { timestamps: true, discriminatorKey: "kind" }
);
personSchema.index(
  { firstName: "text", lastName: "text" },
  {
    weights: { firstName: 1, lastname: 2 },
    default_language: "turkish",
    background: true,
  }
);
personSchema.virtual("fullName").get(function (this: IPerson) {
  return this.firstName + " " + this.lastName;
});

personSchema.pre<IPerson>("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10).then((hash) => {
    this.password = hash;
    next();
  });
});
personSchema.methods.getSecret = function () {
  return `${this.password}-${this.createdAt}`;
};

personSchema.methods.generatePasswordResetToken = function () {
  const secret = this.getSecret();
  return jwt.sign({ userid: this.id }, secret, { expiresIn: "1h" });
};
personSchema.methods.passwordEqualAsync = async function (password: string) {
  return bcrypt.compare(password, this.password);
};
personSchema.methods.verifyPasswordResetToken = function (
  token: string,
  id: ObjectId
) {
  const decoded: any = jwt.decode(token);
  if (!decoded || decoded.userid !== id) throw new Error("");
  const secret = this.getSecret();
  return jwt.verify(token, secret);
};

personSchema.methods.sendConfirmEmail = async function () {
  const tokenDoc = new Token(this.id);
  const tokenVerify = await new TokenModel(tokenDoc).save();
  const transporter = mailTransporter();
  if (!this.email && !this.unVerifiedEmail)
    throw new Error("Email not defined");
  const querys = querystring.stringify({
    token: tokenVerify.token || this.unVerifiedEmail,
    email: this.email,
  });
  const link = url.resolve(
    "http://localhost:3000",
    path.join("confirm", `?${querys}`)
  );
  if (transporter) {
    transporter
      .sendMail({
        from: process.env.MAILER_EMAIL_ID,
        to: this.email || this.unVerifiedEmail,
        subject: "Confirm",
        html: link,
      })
      .catch();
  }
};
personSchema.methods.generateAuthToken = function () {
  const roles: Role[] = [Role.USER];
  if (this.superAdmin === true) roles.push(Role.SUPER_ADMIN);
  if (typeof process.env.SECRET_KEY === "string") {
    const activeUser: IActiveUser = {
      _id: this.id,
      email: this.email,
      roles,
      fullName: this.firstName + " " + this.lastName,
      parentStudents: [],
    };
    return jwt.sign(activeUser, process.env.SECRET_KEY, { expiresIn: "1h" });
  }
};
personSchema.methods.sendForgotPassword = async function () {
  const token = this.generatePasswordResetToken();
  const transporter = mailTransporter();
  if (!this.email) return false;
  let result = false;
  const querys = querystring.stringify({
    token: token,
    id: this.id,
  });
  if (transporter) {
    await transporter
      .sendMail({
        from: process.env.MAILER_EMAIL_ID, // sender address
        to: this.email, // list of receivers
        subject: "Password reset", // Subject line
        html: url.resolve(
          "http://localhost:3000",
          path.join("recovery", `?${querys}`)
        ), // html body
      })
      .then(() => (result = true))
      .catch(() => (result = false));
  }
  return result;
};
personSchema.methods.changePassword = async function (password: string) {
  this.password = password;
  try {
    await this.save();
  } catch (error) {
    return false;
  }
  return true;
};
personSchema.methods.verified = async function () {
  this.isVerified = true;
  try {
    await this.save();
  } catch (error) {
    return false;
  }
  return true;
};
personSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date(Date.now());
  try {
    await this.save();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
export const PersonModel = model<IPerson | IUser | IStudent>(
  "Person",
  personSchema
);
