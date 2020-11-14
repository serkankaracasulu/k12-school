import { ForbiddenError } from 'apollo-server';
import { ApolloError, AuthenticationError, Context, UserInputError } from 'apollo-server-core';
import { IsDate, IsEmail, IsPhoneNumber, Length, Max, Min } from 'class-validator';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import {
    Arg, Authorized, Ctx, Field, FieldResolver, InputType, Int, Mutation, Query, Resolver,
    ResolverInterface, Root, UnauthorizedError
} from 'type-graphql';
import { Container } from 'typedi';

import { UserBuilPath } from '../helper/UserBuildPath';
import { Address } from '../models/address';
import { Department } from '../models/department';
import { IDriver } from '../models/driver';
import { Education } from '../models/education';
import { IPerson, Person, PersonKind, Role } from '../models/person';
import { IStudent } from '../models/student';
import { University } from '../models/university';
import { IUser, User } from '../models/user';
import { ApplicationService } from '../services/application';
import { DepartmentService } from '../services/department';
import { InstitutionService } from '../services/institution';
import { PersonService } from '../services/person';
import { TokenService } from '../services/token';
import { UnivercityService } from '../services/university';
import { UserService } from '../services/user';
import { logger } from '../startup/logging';
import { CContext, IActiveUser } from '../types';
import { AddressInput, LoginToken, ObjectIdScalar, Result } from './types';

@InputType()
class ReSendConfirmEmailInput implements Partial<User> {
  @IsEmail()
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
class UserEditInput implements Partial<User> {
  @Length(2, 50)
  @Field()
  firstName?: string;

  @Length(2, 50)
  @Field()
  lastName?: string;

  @Length(5, 15)
  @Field({ nullable: true })
  phone?: string;

  @Field(() => AddressInput, { nullable: true })
  addressData?: AddressInput;

  @Field({ nullable: true })
  birthDate?: Date;
}

@InputType()
class EducationInput implements Partial<Education> {
  @Field(() => Int)
  educationLevel: number;

  @Field()
  educationLevelName: string;

  @Field(() => ObjectIdScalar)
  universityId: ObjectId;

  @Field()
  universityName: string;

  @Field(() => Int)
  educationType: number;

  @Field()
  educationTypeName: string;

  @Field(() => Int)
  educationlanguage: number;

  @Field()
  educationlanguageName: string;

  @Field(() => ObjectIdScalar)
  departmentId: ObjectId;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  finishDate: Date;
}

@InputType()
class confirmEmailInput implements Partial<User> {
  @Field()
  token: string;

  @Field()
  email: string;
}

@InputType()
class resetPasswordInput {
  @Field()
  token: string;

  @Field(() => ObjectIdScalar)
  _id: ObjectId;

  @Field({ nullable: true })
  password?: string;
}

@InputType()
class UserLoginInput implements Partial<User> {
  @IsEmail()
  @Field()
  email: string;

  @Field()
  password: string;
}
@InputType()
class CreateUserInput implements Partial<User> {
  @Length(2, 50)
  @Field()
  firstName: string;

  @Length(2, 50)
  @Field()
  lastName: string;

  @IsEmail()
  @Field()
  email: string;

  @Length(6, 55)
  @Field()
  password: string;

  @Field({ nullable: true })
  token?: string;
}

@InputType()
class CreateInstInput extends CreateUserInput implements Partial<User> {
  @IsPhoneNumber("TR")
  @Field()
  phone: string;

  @Length(2, 255)
  @Field()
  institutionName: string;

  token: undefined;
}
type IsAuthorize = (activeUser: IActiveUser, person: Person) => boolean;
@Resolver(() => Person)
export class PersonFieldResolver implements ResolverInterface<Person> {
  @FieldResolver(() => [String])
  async roles(
    @Root() user: Person,
    @Ctx() ctx: Context<CContext>
  ): Promise<Role[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new ApolloError("");
    if (activeUser.roles) return activeUser.roles;
    return [];
  }
  @FieldResolver(() => String)
  async citizenshipId(
    @Root() user: Person,
    @Ctx() ctx: Context<CContext>
  ): Promise<string> {
    const { activeUser } = ctx;
    if (!activeUser) throw new ApolloError("");
    if (user._id.toHexString() === activeUser._id)
      return user.citizenshipId || "";
    if (
      activeUser.roles.includes(Role.ADMIN || Role.OWNER) &&
      activeUser.teacher?.institutionId ==
        (user as User).teacher?.institutionId.toHexString()
    )
      return user.citizenshipId || "";
    return "";
  }
  @FieldResolver(() => Address)
  async address(
    @Root() user: Person | IPerson,
    @Ctx() ctx: Context<CContext>
  ): Promise<Address | undefined> {
    const { activeUser } = ctx;
    if (!activeUser) throw new ApolloError("");
    if (user._id.toHexString() === activeUser._id) return user.address;
    if (
      this.isAdminAndAuthorized(activeUser, user) ||
      this.isParentAndAuthorized(activeUser, user)
    )
      return user.address;
  }
  private isAdminAndAuthorized: IsAuthorize = (
    activeUser: IActiveUser,
    user: Person
  ) => {
    return (
      activeUser.roles.includes(Role.ADMIN || Role.OWNER) &&
      activeUser.teacher?.institutionId ==
        (user as User).teacher?.institutionId.toHexString()
    );
  };
  private isParentAndAuthorized: IsAuthorize = (
    activeUser: IActiveUser,
    user: Person
  ) => {
    return (
      activeUser.roles.includes(Role.PARENT) &&
      activeUser.parentStudents.some(
        (ps) => ps.studentId === user._id.toHexString()
      )
    );
  };
}

@Resolver(() => Education)
export class EducationFieldResolver implements ResolverInterface<Education> {
  /**
   *
   */
  private readonly departmentService: DepartmentService;
  private readonly univercityService: UnivercityService;
  constructor() {
    this.univercityService = Container.get(UnivercityService);
    this.departmentService = Container.get(DepartmentService);
  }

  @FieldResolver()
  async department(
    @Root() education: Education,
    @Ctx() ctx: Context<CContext>
  ): Promise<Department | undefined> {
    if (education.departmentId) {
      const department = await this.departmentService.getById(
        education.departmentId
      );
      if (department) return department;
    }
  }
  @FieldResolver(() => University)
  async university(
    @Root() education: Education,
    @Ctx() ctx: Context<CContext>
  ): Promise<University | undefined> {
    if (education.universityId) {
      const university = await this.univercityService.getById(
        education.universityId
      );
      if (university) return university;
    }
  }
}

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly applicationService: ApplicationService,
    private readonly institutionService: InstitutionService,
    private readonly tokenService: TokenService,
    private readonly personService: PersonService
  ) {
    this.userService = Container.get(UserService);
    this.applicationService = Container.get(ApplicationService);
    this.institutionService = Container.get(InstitutionService);
    this.tokenService = Container.get(TokenService);
    this.personService = Container.get(PersonService);
  }

  @Authorized()
  @Query(() => Person)
  async activeUser(@Ctx() ctx: Context<CContext>): Promise<Person> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const user = await this.personService.getById(new ObjectId(activeUser._id));
    if (user) return user;
    throw new ApolloError("");
  }
  @Authorized()
  @Query(() => Person)
  async person(
    @Ctx() ctx: Context<CContext>,
    @Arg("personId", () => ObjectIdScalar) personId: ObjectId
  ): Promise<Person> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const person = await this.personService.getById(personId);
    if (!person) throw new ApolloError("User didn't find");
    return this.returnPersonIfValid(activeUser, person);
  }
  @Authorized()
  @Query(() => User)
  async user(
    @Ctx() ctx: Context<CContext>,
    @Arg("userId", () => ObjectIdScalar) userId: ObjectId
  ): Promise<Person> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const user = await this.userService.getById(userId);
    if (!user) throw new ApolloError("User didn't find");
    return this.returnPersonIfValid(activeUser, user);
  }
  @Authorized()
  @Query(() => [Education])
  async educations(@Ctx() ctx: Context<CContext>): Promise<Education[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const user = await this.userService.getById(new ObjectId(activeUser._id));
    if (user) return user.educations;
    throw new AuthenticationError("");
  }
  @Authorized()
  @Mutation(() => Result)
  async changeUserPhoto(
    @Ctx() ctx: Context<CContext>,
    @Arg("profilePhotoBase64") profilePhotoBase64: string
  ): Promise<Result> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const result = await this.userService.updatePhoto(
      profilePhotoBase64,
      new ObjectId(activeUser._id),
      new UserBuilPath()
    );
    return { success: result };
  }
  @Mutation(() => LoginToken)
  async signIn(@Arg("data") data: UserLoginInput): Promise<LoginToken> {
    const user = await this.personService.getByEmail(data.email);
    if (!user) throw new ApolloError("Email or password is wrong", "102");
    const isValid = await user.passwordEqualAsync(data.password);
    if (!isValid) throw new ApolloError("Email or password is wrong", "102");
    if (!user.isVerified)
      throw new ApolloError(
        "Please confirm your email. Didn't recive email?",
        "103"
      );
    await user.updateLastLogin();
    const token = user.generateAuthToken();
    if (!token) throw new ApolloError("");
    return { token };
  }
  @Mutation(() => Person)
  async createUser(
    @Arg("inputData") inputData: CreateUserInput
  ): Promise<Person> {
    const { token, ...userData } = inputData;
    const userExist = await this.userService.isExistByEmail(inputData.email);

    if (userExist)
      throw new ApolloError("User already registered", "100", { isUser: true });
    try {
      if (typeof process.env.SECRET_KEY !== "string") throw new ApolloError("");
      const decoded: any = token && jwt.verify(token, process.env.SECRET_KEY);
      if (token && !decoded) throw Error("Invalid token");
      const user = await this.userService.create(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password
      );
      if (!user) throw new ApolloError("Failed");
      if (token && decoded && decoded._id) {
        if (decoded.userType === Role.DRIVER) {
          user.driver = { _id: new ObjectId() } as IDriver;
        } else if (decoded.userType === Role.TEACHER) {
        }
        const updateResult = await this.applicationService.updateStatusByEmail(
          1,
          decoded._id,
          userData.email,
          user._id
        );
        if (updateResult) {
          user.isVerified = true;
          await user.save();
        }
        return user;
      }
      user.sendConfirmEmail();
      return user;
    } catch {
      throw console.error();
    }
  }
  @Mutation(() => User)
  async createInst(
    @Arg("inputData") inputData: CreateInstInput
  ): Promise<User> {
    const { ...userData } = inputData;
    const userExist = await this.userService.isExistByEmail(inputData.email);
    if (userExist)
      throw new ApolloError("User already registered", "100", { isUser: true });
    const institutionExist = await this.institutionService.isExistByName(
      inputData.institutionName
    );
    if (institutionExist)
      throw new ApolloError("Name already registered", "100", {
        isInstitution: true,
      });
    try {
      const user = await this.userService.create(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password
      );
      if (!user) throw new Error("Failed");
      const inst = await this.institutionService.create(
        user._id,
        inputData.institutionName
      );
      await this.userService.updateSchool(user._id, inst._id);
      await user.sendConfirmEmail();
      return user;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  @Mutation(() => Result)
  async forgotPassword(@Arg("email") email: string): Promise<Result> {
    const user = await this.personService.getByEmail(email);
    if (!user) throw new ApolloError("Email does not exist", "102");
    const result = await user.sendForgotPassword();
    return { success: result };
  }
  @Mutation(() => Result)
  async resetPassword(@Arg("data") data: resetPasswordInput): Promise<Result> {
    const { token, password, _id } = data;
    const user = await this.personService.getById(_id);
    if (!user) throw new ApolloError("User does not exist", "102");
    const result = user.verifyPasswordResetToken(token, _id);
    if (!result) throw new ApolloError("İnvalid request", "104");
    if (!password) return { success: false };
    const updateResult = await user.changePassword(password);
    try {
      await user.save();
    } catch (error) {
      logger.error(error);
      throw error;
    }
    return { success: updateResult };
  }
  @Mutation(() => Result)
  async confirmEmail(@Arg("data") data: confirmEmailInput): Promise<Result> {
    const { token, email } = data;
    const userToken = await this.tokenService.getByToken(token);
    if (!userToken) throw new ApolloError("Token does not exist", "102");
    const user = await this.personService.getByEmail(email);
    if (!user) throw new ApolloError("User does not exist", "102");
    const tokenUser = userToken._userId as IUser;
    if (typeof tokenUser === "object" && tokenUser.email !== email)
      throw new ApolloError("User does not exist", "102");
    if (user.isVerified)
      throw new ApolloError("User's mail already confirmed", "100");
    const result = await user.verified();
    return { success: result };
  }
  @Mutation(() => Result)
  async reSendConfirmEmail(
    @Arg("data") data: ReSendConfirmEmailInput
  ): Promise<Result> {
    const { email, password } = data;
    const user = await this.personService.getByEmail(email);
    if (!user) throw new ApolloError("User does not exist", "102");
    const isValid = await user.passwordEqualAsync(password);
    if (!isValid) throw new UserInputError("");
    await user.sendConfirmEmail();
    return { success: true };
  }
  @Authorized()
  @Mutation(() => User)
  async editUser(
    @Arg("data") data: UserEditInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<User> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const user = await this.userService.update(
      data,
      new ObjectId(activeUser._id)
    );
    if (user) return user;
    throw new ApolloError("User didn't find");
  }
  @Authorized()
  @Mutation(() => Education)
  async editEducation(
    @Arg("education") education: EducationInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<Education> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const educationResult = await this.userService.addEducation(
      education,
      new ObjectId(activeUser._id)
    );
    if (educationResult) {
      return educationResult;
    } else throw new ApolloError("");
  }
  @Authorized()
  @Query(() => [User])
  async findUser(
    @Arg("search") search: string,
    @Ctx() ctx: Context<CContext>
  ): Promise<User[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return await this.userService.getManyByTextSearchUser(search, activeUser);
  }
  private returnPersonIfValid(
    activeUser: IActiveUser,
    person: IUser | IPerson | IStudent
  ): Person {
    if (!activeUser) throw new AuthenticationError("");
    if (!person) throw new ApolloError("User didn't find");
    if ((person as IUser).teacher || (person as IUser).driver) {
      const certainUser = person as IUser;
      if (certainUser.driver)
        return (person as IPerson).toObject({ virtuals: true });
      if (certainUser.teacher) {
        if (
          activeUser.driver &&
          activeUser.driver.some(
            (d) =>
              certainUser.teacher &&
              d.institutionId ===
                certainUser.teacher.institutionId.toHexString()
          )
        )
          return (person as IPerson).toObject({ virtuals: true });
        else if (
          activeUser.teacher &&
          activeUser.teacher.institutionId ===
            certainUser.teacher.institutionId.toHexString()
        )
          return (person as IPerson).toObject({ virtuals: true });
      }
    } else if (person.kind === PersonKind.student) {
      const certainUser = person as IStudent;
      if (
        activeUser.driver &&
        activeUser.driver.some(
          (d) =>
            d.institutionId === certainUser.institutionId.toHexString() &&
            d.studentIds.includes(certainUser.id)
        )
      )
        return (person as IPerson).toObject({ virtuals: true });
      else if (
        activeUser.teacher &&
        activeUser.teacher.institutionId ===
          certainUser.institutionId.toHexString()
      )
        return (person as IPerson).toObject({ virtuals: true });
    }
    throw new ForbiddenError("");
  }
}
