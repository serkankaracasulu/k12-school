import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  InputType,
  Field,
  Query,
  Authorized,
  ObjectType,
  FieldResolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Context, ApolloError, AuthenticationError } from "apollo-server-core";
import { Length, IsEmail } from "class-validator";
import {
  ParentStudent,
  ParentType,
  parentStudentSchema,
} from "../models/parent";
import { CContext } from "../types";
import { logger } from "../startup/logging";
import { Student } from "./../models/student";
import { RemoveResult, Result, ObjectIdScalar } from "./types";
import { Person, Role } from "../models/person";
import { StudentService } from "./../services/student";
import { Container } from "typedi";
import { PersonService } from "./../services/person";
import { ParentService } from "./../services/parent";
import { TokenService } from "./../services/token";
import { ObjectId } from "mongodb";
import { UserService } from "./../services/user";
import { User } from "../models/user";
import generatePassword from "./../helper/generatePassword";
import { ParentApplication } from "./../models/parentApplication";
import { ParentApplicationService } from "./../services/parentApplication";
import { ForbiddenError } from "apollo-server";
import { Application } from "./../models/application";

@InputType()
class ParentInput implements Partial<Person> {
  @Length(2, 50)
  @Field()
  firstName: string;

  @Length(2, 50)
  @Field()
  lastName: string;

  @Length(11, 11)
  @Field()
  citizenshipId: string;

  @Length(5, 15)
  @Field({ nullable: true })
  phone?: string;

  @Field(() => ObjectIdScalar)
  studentId: Student["_id"];

  @IsEmail()
  @Field()
  unVerifiedEmail: string;

  @Field({ nullable: true })
  birthDate?: Date;

  @Field(() => ParentType)
  parentType: ParentType;
}

@ObjectType()
class ParentEmailConfirm {
  @Field(() => ObjectIdScalar)
  token: string;

  @Field(() => ObjectIdScalar)
  _id: string;
}
@InputType()
class ParentConfirmEmailInput implements Partial<Person> {
  @Field()
  token: string;

  @IsEmail()
  @Field()
  unVerifiedEmail: string;
}

@InputType()
class ParentResetPasswordInput {
  @Field()
  token: string;

  @Field(() => ObjectIdScalar)
  _id: ObjectId;

  @Length(6, 20)
  @Field({ nullable: true })
  password?: string;
}

@InputType()
class ResendConfirmEmailInput {
  @IsEmail()
  @Field()
  unVerifiedEmail: string;

  @Length(11, 11)
  @Field()
  citizenshipId: string;
}

/*
@Resolver(() => ParentStudent)
export class ParentFieldResolver implements ResolverInterface<ParentStudent> {
  constructor(private readonly personService: PersonService) {
    this.personService = Container.get(PersonService);
  }
  @Authorized()
  @FieldResolver(() => [Person])
  async students(
    @Root() parent: ParentStudent,
    @Ctx() ctx: Context<CContext>
  ): Promise<Person[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new ApolloError("");
    return await this.personService.getManyById(
      parent.parentStudents.map((ps) => ps.studentId)
    );
  }
}
*/

@Resolver()
export class ParentResolver {
  userService: UserService;
  constructor(
    private readonly parentService: ParentService,
    private readonly studentService: StudentService,
    private readonly parentApplicationService: ParentApplicationService,
    private readonly tokenService: TokenService
  ) {
    this.parentService = Container.get(ParentService);
    this.tokenService = Container.get(TokenService);
    this.studentService = Container.get(StudentService);
    this.userService = Container.get(UserService);
    this.parentApplicationService = Container.get(ParentApplicationService);
  }

  @Authorized()
  @Query(() => User)
  @Authorized(Role.ADMIN, Role.OWNER, Role.TEACHER)
  @Query(() => User)
  async parent(
    @Ctx() ctx: Context<CContext>,
    @Arg("citizenshipId") citizenshipId: string
  ): Promise<Person> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const parent = await this.parentService.getByCitizenshipId(
      new ObjectId(activeUser.teacher.institutionId),
      citizenshipId
    );
    if (parent) return parent;
    throw new ApolloError("Paren't didnt find");
  }

  @Authorized(Role.ADMIN, Role.OWNER, Role.TEACHER)
  @Query(() => [User])
  async studentParents(
    @Ctx() ctx: Context<CContext>,
    @Arg("studentId", () => ObjectIdScalar) studentId: ObjectId
  ): Promise<User[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    return await this.parentService.getParentsOfStudent(
      new ObjectId(activeUser.teacher.institutionId),
      studentId
    );
  }
  @Authorized(Role.ADMIN, Role.OWNER, Role.TEACHER)
  @Mutation(() => User)
  async addParent(
    @Ctx() ctx: Context<CContext>,
    @Arg("applicationId", () => ObjectIdScalar)
    applicationId: Application["_id"]
  ): Promise<User> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const application = await this.parentApplicationService.getParentApplicationById(
      applicationId
    );
    if (
      application?.institutionId.toHexString() !==
        activeUser.teacher.institutionId ||
      application.userId == null
    )
      throw new ForbiddenError("");
    const partenStudent = {
      institutionId: new ObjectId(activeUser.teacher.institutionId),
      parentType: ParentType.Father,
      studentId: application.studentId,
    };
    const updatedParent = await this.parentService.addStudent(
      partenStudent,
      application.userId
    );
    if (updatedParent) {
      const r = updatedParent.parentStudents.some((e) =>
        e.studentId.equals(application.studentId)
      );
      if (r) {
        this.parentApplicationService.remove(
          new ObjectId(activeUser.teacher.institutionId),
          applicationId
        );
        return updatedParent;
      }
    }
    throw new ApolloError("");
  }
  @Authorized(Role.ADMIN, Role.OWNER, Role.TEACHER)
  @Mutation(() => RemoveResult)
  async removeParent(
    @Ctx() ctx: Context<CContext>,
    @Arg("parentId", () => ObjectIdScalar) parentId: User["_id"],
    @Arg("studentId", () => ObjectIdScalar) studentId: Student["_id"]
  ): Promise<RemoveResult> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const student = await this.studentService.isExistStudentById(
      new ObjectId(activeUser._id),
      studentId
    );
    if (!student) throw new ApolloError("Student didn't find", "102");
    const parentUser = await this.parentService.getParentById(
      new ObjectId(activeUser._id),
      parentId
    );
    if (!parentUser) throw new ApolloError("Parent didn't find", "103");
    if (!parentUser.parentStudents.some((e) => e.studentId.equals(studentId)))
      throw new ApolloError("Student not exist in parent", "100");
    const result = await this.parentService.pullStudent(studentId, parentId);
    if (result)
      return { code: "200", success: true, _id: parentId.toHexString() };
    throw new ApolloError("");
  }

  @Mutation(() => ParentEmailConfirm)
  async parentConfirmEmail(
    @Arg("data") data: ParentConfirmEmailInput
  ): Promise<ParentEmailConfirm> {
    const { token, unVerifiedEmail } = data;
    const parentToken = await this.tokenService.getByToken(token);
    if (!parentToken) throw new ApolloError("Token does not exist", "103");
    const parent = await this.parentService.getParentByUnverifiedEmail(
      unVerifiedEmail,
      parentToken._id
    );
    if (!parent) throw new ApolloError("User does not exist", "102");
    const result = await this.parentService.verifiedEmail(
      unVerifiedEmail,
      parent._id
    );
    if (!result) throw new ApolloError("");
    const resetToken = parent.generatePasswordResetToken();
    return { token: resetToken, _id: parent.id };
  }
  @Mutation(() => Result)
  async parentResetPassword(
    @Arg("data") data: ParentResetPasswordInput
  ): Promise<Result> {
    const { token, password, _id } = data;
    const parent = await this.parentService.getById(_id);
    if (!parent) throw new ApolloError("User does not exist", "102");
    const result = parent.verifyPasswordResetToken(token, _id);
    if (!result) throw new ApolloError("Invalid request", "104");
    if (!password) return { success: false };
    parent.password = password;
    try {
      await parent.save();
    } catch (error) {
      logger.error(error);
      throw error;
    }
    return { success: true };
  }
  @Mutation(() => Result)
  async parentForgotPassword(@Arg("email") email: string): Promise<Result> {
    const parent = await this.parentService.getByEmail(email);
    if (!parent) throw new ApolloError("Email does not exist", "102");
    const result = await parent.sendForgotPassword();
    return { success: result };
  }
  @Mutation(() => Result)
  async parentResendConfirmEmail(
    @Arg("data") data: ResendConfirmEmailInput
  ): Promise<Result> {
    const { unVerifiedEmail, citizenshipId } = data;
    const parent = await this.parentService.getParentByTCandUnVEmail(
      citizenshipId,
      unVerifiedEmail
    );
    if (!parent) throw new ApolloError("User does not exist", "102");
    await parent.sendConfirmEmail();
    return { success: true };
  }
  @Authorized(Role.PARENT)
  @Query(() => [Person])
  async myChildren(@Ctx() ctx: Context<CContext>): Promise<Person[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    if (activeUser.parentStudents.length == 0) return [];
    return await this.studentService.getManyById(
      activeUser.parentStudents.map((s) => new ObjectId(s.studentId))
    );
  }
}
