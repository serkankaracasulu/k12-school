/* eslint-disable no-unused-vars */

import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  InputType,
  Field,
  Int,
  Query,
  FieldResolver,
  Root,
  ResolverInterface,
  Authorized,
} from "type-graphql";
import { RemoveResult, ObjectIdScalar } from "./types";
import { Context, ApolloError, AuthenticationError } from "apollo-server-core";
import findStartEndOfWeek from "../helper/findWeekStartEnd";
import { ClassType, IClass } from "../models/classSchema";
import { ISchool } from "../models/schoolSchema";
import { UpdateResult } from "./types";
import { CContext } from "../types";
import { Length, Min, Max } from "class-validator";
import { Lesson } from "../models/lessonSchema";
import { DateTime } from "luxon";
import { Container } from "typedi";
import { StudentService } from "../services/student";
import { LessonService } from "./../services/lesson";
import { ClassService } from "./../services/classType";
import { SchoolService } from "./../services/school";
import { Role } from "../models/person";
import { ObjectId } from "mongodb";
import { ForbiddenError } from "apollo-server";

@InputType()
class TeacherLessonInput {
  @Field(() => [ObjectIdScalar], { nullable: true })
  classes?: ObjectId[];

  @Field(() => Int, { nullable: true })
  week?: number;

  @Field({ nullable: true })
  notMine: boolean;

  @Field(() => ObjectIdScalar, { nullable: true })
  teacherId?: ObjectId;
}

@InputType()
class CreateClassInput implements Partial<ClassType> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: IClass["_id"];

  @Field(() => ObjectIdScalar)
  schoolId: ISchool["_id"];

  @Length(2, 255)
  @Field({ nullable: true })
  name?: string;

  @Min(0)
  @Max(50)
  @Field(() => Int)
  level: number;

  @Length(0, 3)
  @Field({ nullable: true })
  code?: string;

  @Length(2, 255)
  @Field({ nullable: true })
  code1?: string;
}

@Resolver(() => ClassType)
export class ClassFieldResolver implements ResolverInterface<ClassType> {
  constructor(
    private readonly studentService: StudentService,
    private readonly lessonService: LessonService,
    private readonly schoolService: SchoolService
  ) {
    this.schoolService = Container.get(SchoolService);
    this.studentService = Container.get(StudentService);
    this.lessonService = Container.get(LessonService);
  }

  @FieldResolver(() => String)
  async fullName(@Root() cl: IClass | ClassType) {
    return ` ${cl.level} ${cl.code || ""} ${cl.code1 || ""} ${cl.name || ""}`;
  }
  @FieldResolver(() => Int)
  async studentCount(
    @Root() cl: IClass | ClassType,
    @Ctx() ctx: Context<CContext>
  ): Promise<number> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return await this.studentService.getCountByClassId(cl._id);
  }
  @FieldResolver(() => Int)
  async lessonCount(
    @Root() cl: IClass | ClassType,
    @Ctx() ctx: Context<CContext>
  ): Promise<number> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return await this.lessonService.getCountByClassId(cl._id);
  }
  @FieldResolver(() => [Lesson])
  async lessons(
    @Root() cl: IClass | ClassType,
    @Ctx() ctx: Context<CContext>,
    @Arg("query", () => TeacherLessonInput) query: TeacherLessonInput
  ): Promise<Lesson[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const { week, classes, notMine, teacherId } = query;
    if (teacherId && !activeUser.roles.includes(Role.OWNER || Role.ADMIN))
      throw new ForbiddenError("");
    const school = await this.schoolService.getByClassId(
      new ObjectId(activeUser.teacher.institutionId),
      cl._id
    );
    if (!school) return [];
    const [firstDay, lastDay] = findStartEndOfWeek(week || 0);
    const tuple = school.getEducationYearByDateRange(firstDay, lastDay);
    if (!tuple) return [];
    const [educationYear, term] = tuple;
    if (!term) return [];
    if (
      classes &&
      !classes.some((a) => a.toHexString() === cl._id.toHexString())
    )
      return [];
    if (term.start.valueOf() > firstDay.valueOf()) {
      const datetime = DateTime.fromJSDate(term.start).toUTC();
      const day = datetime.weekday - 1;
      return await this.lessonService.getManyGtDay(
        teacherId || new ObjectId(activeUser._id),
        cl._id,
        educationYear._id,
        day,
        notMine
      );
    }
    if (term.finish.valueOf() < lastDay.valueOf()) {
      const datetime = DateTime.fromJSDate(term.finish).toUTC();
      const day = datetime.weekday - 1;
      return await this.lessonService.getManyLtDay(
        teacherId || new ObjectId(activeUser._id),
        cl._id,
        educationYear._id,
        day,
        notMine
      );
    }
    if (notMine)
      return await this.lessonService.getManyExcludingTeacherForEducationYearInClass(
        teacherId || new ObjectId(activeUser._id),
        educationYear._id,
        cl._id
      );
    return await this.lessonService.getManyTeacherForEducationYearInClass(
      teacherId || new ObjectId(activeUser._id),
      educationYear._id,
      cl._id
    );
  }
}

@Resolver()
export class ClassResolver {
  constructor(
    private readonly classService: ClassService,
    private readonly studentService: StudentService
  ) {
    this.classService = Container.get(ClassService);
    this.studentService = Container.get(StudentService);
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Query(() => [ClassType])
  async classes(
    @Ctx() ctx: Context<CContext>,
    @Arg("id", () => ObjectIdScalar) id: ObjectId
  ): Promise<ClassType[] | null> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    return await this.classService.getManyById(
      new ObjectId(activeUser.teacher.institutionId),
      id
    );
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Query(() => ClassType)
  async class(
    @Ctx() ctx: Context<CContext>,
    @Arg("schoolId", () => ObjectIdScalar) schoolId: ObjectId,
    @Arg("classId", () => ObjectIdScalar) classId: ObjectId
  ): Promise<ClassType | null> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const cl = await this.classService.getById(
      new ObjectId(activeUser.teacher.institutionId),
      schoolId,
      classId
    );
    if (!cl) throw new Error("Class didn't find");
    return cl;
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => ClassType)
  async createClass(
    @Arg("data") data: CreateClassInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<ClassType> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const { schoolId, _id, ...classData } = data;
    if (_id) {
      return await this.classService.update(
        classData,
        new ObjectId(activeUser.teacher.institutionId),
        schoolId,
        _id
      );
    } else {
      const classItem = await this.classService.getManyByData(
        classData,
        new ObjectId(activeUser.teacher.institutionId),
        schoolId
      );
      if (classItem.length > 0) throw new ApolloError("This class have exist");
      return await this.classService.create(
        classData,
        new ObjectId(activeUser.teacher.institutionId),
        schoolId
      );
    }
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => UpdateResult)
  async setClassroomTeacher(
    @Arg("schoolId", () => ObjectIdScalar) schoolId: ObjectId,
    @Arg("classId", () => ObjectIdScalar) classId: ObjectId,
    @Ctx() ctx: Context<CContext>,
    @Arg("userId", () => ObjectIdScalar, { nullable: true }) userId?: ObjectId
  ): Promise<UpdateResult> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    let result = false;
    if (userId) {
      result = await this.classService.updateTeacher(
        new ObjectId(activeUser.teacher.institutionId),
        schoolId,
        classId,
        userId
      );
    } else {
      result = await this.classService.updateRemoveTeacher(
        new ObjectId(activeUser.teacher.institutionId),
        schoolId,
        classId
      );
    }
    return { code: "200", success: result };
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => RemoveResult)
  async deleteClass(
    @Arg("schoolId", () => ObjectIdScalar) schoolId: ObjectId,
    @Arg("classId", () => ObjectIdScalar) classId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<RemoveResult> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const result = await this.classService.remove(
      new ObjectId(activeUser.teacher.institutionId),
      schoolId,
      classId
    );
    if (!result) throw new ApolloError("Failed");
    await this.studentService.dismissClassBySchoolId(
      new ObjectId(activeUser.teacher.institutionId),
      classId
    );
    return { code: "200", success: false, _id: "" };
  }
}
