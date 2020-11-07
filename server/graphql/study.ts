import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  InputType,
  Field,
  Int,
  Query,
  Authorized,
  FieldResolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Context, AuthenticationError, ApolloError } from "apollo-server-core";
import { CContext } from "../types";
import {
  IsMongoId,
  IsDate,
  MinDate,
  Length,
  Min,
  ArrayUnique,
  Max,
} from "class-validator";
import {
  Study,
  StudyStudent,
  IStudyStudent,
  StudyStudentStatus,
} from "../models/study";
import { IStudy, StudyState } from "./../models/study";
import { DateTime } from "luxon";
import { StudyService } from "./../services/study";
import { Container } from "typedi";
import { LessonGService } from "../services/lessonG";
import { Person, Role } from "./../models/person";
import { PersonService } from "./../services/person";
import { ForbiddenError } from "apollo-server";
import { RemoveResult, ObjectIdScalar } from "./types";
import { ObjectId } from "mongodb";

@InputType()
class StudyInput implements Partial<Study> {
  @Field(() => ObjectIdScalar, { nullable: true })
  lessonId?: ObjectId;

  @MinDate(DateTime.local().plus({ hours: -5 }).toJSDate())
  @IsDate()
  @Field()
  date: Date;

  @Min(0)
  @Max(480)
  @Field(() => Int)
  duration: number;

  @Length(2, 70)
  @Field()
  subject: string;

  @Length(2, 280)
  @Field({ nullable: true })
  detail?: string;

  @Field({ nullable: true })
  public: boolean;

  @Min(0)
  @Field(() => Int, { nullable: true })
  capacity?: number;

  @ArrayUnique()
  @Field(() => [ObjectIdScalar], { nullable: true })
  permissionClasses?: ObjectId[];
}

@InputType()
class StudyQuery implements Partial<Study> {
  @Field(() => ObjectIdScalar, { nullable: true })
  lessonId?: ObjectId;

  @MinDate(DateTime.local().plus({ hours: -5 }).toJSDate())
  @IsDate()
  @Field({ nullable: true })
  date?: Date;

  @IsDate()
  @Field({ nullable: true })
  endDate?: Date;
}

@Resolver(() => Study)
export class StudyFieldResolver implements ResolverInterface<Study> {
  constructor(private readonly lessonGService: LessonGService) {
    this.lessonGService = Container.get(LessonGService);
  }
  @FieldResolver(() => Int)
  async lessonName(
    @Root() study: IStudy | Study,
    @Ctx() ctx: Context<CContext>
  ): Promise<string> {
    if (!study.lessonId) return "";
    const lesson = await this.lessonGService.getById(study.lessonId);
    if (lesson) return lesson.name;
    return "deleted";
  }
}

@Resolver(() => StudyStudent)
export class StudyStudentFieldResolver
  implements ResolverInterface<StudyStudent> {
  constructor(private readonly personService: PersonService) {
    this.personService = Container.get(PersonService);
  }
  @Authorized(Role.TEACHER)
  @FieldResolver(() => Person, { nullable: true })
  async student(
    @Root() study: IStudyStudent | StudyStudent,
    @Ctx() ctx: Context<CContext>
  ): Promise<Person | undefined> {
    return await this.personService.getById(study.studentId);
  }
}

Resolver();
export class StudyResolver {
  constructor(private readonly studyService: StudyService) {
    this.studyService = Container.get(StudyService);
  }
  @Authorized(Role.TEACHER, Role.STUDENT)
  @Query(() => [Study])
  async studies(
    @Ctx() ctx: Context<CContext>,
    @Arg("query", () => StudyQuery, { nullable: true }) query?: StudyQuery,
    @Arg("week", () => Int, { nullable: true }) week?: number,
    @Arg("teacherId", () => ObjectIdScalar, { nullable: true })
    teacherId?: ObjectId
  ): Promise<Study[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    if (activeUser.roles.includes(Role.TEACHER)) {
      return await this.studyService.getManyByTeacherId(
        teacherId || new ObjectId(activeUser._id),
        week || 0
      );
    }
    if (activeUser.roles.includes(Role.STUDENT) && activeUser.student) {
      if (!activeUser.student.classId)
        throw new ForbiddenError("class does not exist");
      if (query) {
        return await this.studyService.getManyByQuery({
          ...query,
          classId: new ObjectId(activeUser.student.classId),
        });
      } else {
        return await this.studyService.getManyByStudentId(
          new ObjectId(activeUser._id),
          week || 0
        );
      }
    }
    throw new ForbiddenError("");
  }
  @Authorized(Role.STUDENT)
  @Mutation(() => Study)
  async joinStudy(
    @Arg("studyId", () => ObjectIdScalar) studyId: ObjectId,
    @Ctx() ctx: Context<CContext>,
    @Arg("r", { nullable: true }) r?: boolean
  ): Promise<Study> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.student) throw new AuthenticationError("");
    const study = await this.studyService.getById(studyId);
    if (!study) throw new ApolloError("Study didn't find", "202");
    if (!activeUser.student.classId) throw new ForbiddenError("class");
    if (!study.isPermissionClass(activeUser.student.classId))
      throw new ForbiddenError("");
    if (study.isCapacityFull())
      throw new ApolloError("Study capacity is full", "203");
    let updated;
    if (r) {
      updated = await this.studyService.leave(
        study.id,
        new ObjectId(activeUser._id)
      );
      if (updated) return updated;
    } else {
      const others = await this.studyService.getManyIntersectionForStudent(
        new ObjectId(activeUser._id),
        study
      );
      if (others.length > 0)
        throw new ApolloError("You have other study during this time", "200");
      updated = await this.studyService.join(
        study,
        new ObjectId(activeUser._id),
        new ObjectId(activeUser.student.classId)
      );
    }
    if (updated) return updated;
    throw new ApolloError("Study didn't find", "202");
  }
  @Authorized(Role.TEACHER)
  @Mutation(() => Study)
  async acceptJoinStudy(
    @Arg("studyId", () => ObjectIdScalar) studyId: ObjectId,
    @Arg("studentId", () => ObjectIdScalar) studentId: ObjectId,
    @Ctx() ctx: Context<CContext>,
    @Arg("r", { nullable: true }) r?: boolean,
    @Arg("status", () => StudyStudentStatus, {
      nullable: true,
      description: "student didn't join",
    })
    status?: StudyStudentStatus
  ): Promise<Study> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    let study;
    if (r) {
      study = await this.studyService.leave(studyId, studentId);
    } else {
      study = await this.studyService.updateStatus({
        studyId,
        studentId,
        teacherId: new ObjectId(activeUser._id),
        status: status || StudyStudentStatus.Accept,
      });
    }
    if (study) return study;
    throw new ApolloError("Study didn't find", "202");
  }
  @Authorized(Role.TEACHER)
  @Mutation(() => Study)
  async createStudy(
    @Arg("data", () => StudyInput) data: StudyInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<Study> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const stuiesOfTeacher = await this.studyService.getManyIntersectionForTeacher(
      new ObjectId(activeUser._id),
      data.date,
      data.duration
    );
    if (stuiesOfTeacher.length > 0)
      throw new ApolloError("You have other study during this time", "200");
    try {
      return await this.studyService.create({
        ...data,
        institutionId: new ObjectId(activeUser.teacher.institutionId),
        teacherId: new ObjectId(activeUser._id),
      });
    } catch (error) {
      throw error;
    }
  }
  @Authorized(Role.TEACHER)
  @Mutation(() => RemoveResult)
  async deleteStudy(
    @Arg("studyId", () => ObjectIdScalar) studyId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<RemoveResult> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const result = await this.studyService.remove(
      studyId,
      new ObjectId(activeUser._id)
    );
    return {
      code: "200",
      _id: result ? studyId.toHexString() : "",
      success: result,
    };
  }
  @Authorized(Role.TEACHER)
  @Mutation(() => Study)
  async updateStudyState(
    @Arg("studyId", () => ObjectIdScalar) studyId: ObjectId,
    @Arg("studyStudentId", () => ObjectIdScalar) studyStudentId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<Study> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const study = await this.studyService.updateState(
      new ObjectId(activeUser._id),
      studyId,
      StudyState.Read,
      studyStudentId
    );
    if (!study) throw new ApolloError("Study didn't find");
    return study;
  }
}
