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
import { Lesson } from "../models/lessonSchema";
import { RemoveResult, ObjectIdScalar } from "./types";
import { Context, ApolloError, AuthenticationError } from "apollo-server-core";
import { CContext } from "../types";
import { IsMongoId, Length, Min, Max } from "class-validator";
import { ILesson } from "./../models/lessonSchema";
import { LessonG } from "../models/lessonGModel";
import { Person, Role } from "../models/person";
import { LessonService } from "./../services/lesson";
import { Container } from "typedi";
import { EducationYearService } from "./../services/educationYear";
import { WeeklyHourService } from "./../services/weeklyHour";
import { SchoolService } from "./../services/school";
import { LessonGService } from "./../services/lessonG";
import { PersonService } from "./../services/person";
import { WeeklyScheduleService } from "./../services/weeklySchedule";
import { ObjectId } from "mongodb";

@InputType()
class LessonScheduleInput implements Partial<Lesson> {
  @Field(() => ObjectIdScalar)
  lessonId: ObjectId;

  @Min(0)
  @Max(6)
  @Field(() => Int)
  day: number;

  @Field(() => Int)
  hourCode: number;
}

@InputType()
class LessonsInput implements Partial<Lesson> {
  @Field(() => ObjectIdScalar)
  schoolId: ObjectId;

  @Field(() => ObjectIdScalar)
  classId: ObjectId;

  @Field(() => ObjectIdScalar)
  educationYearId: ObjectId;
}

@InputType()
class LessonInput implements Partial<Lesson> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: ObjectId;

  @Field(() => ObjectIdScalar)
  schoolId: ObjectId;

  @Field(() => ObjectIdScalar)
  classId: ObjectId;

  @Field(() => ObjectIdScalar, { nullable: true })
  lessonId?: ObjectId;

  @Length(2, 255)
  @Field({ nullable: true })
  name?: string;

  @Min(0)
  @Max(49)
  @Field(() => Int)
  weeklyHour: number;

  @Field(() => ObjectIdScalar, { nullable: true })
  teacherId?: ObjectId;
}

@Resolver(() => Lesson)
export class LessonFieldResolver implements ResolverInterface<Lesson> {
  constructor(
    private readonly lessonGService: LessonGService,
    private readonly personService: PersonService
  ) {
    this.lessonGService = Container.get(LessonGService);
    this.personService = Container.get(PersonService);
  }

  @FieldResolver(() => String)
  async lessonName(
    @Root() lesson: ILesson | Lesson,
    @Ctx() ctx: Context<CContext>
  ): Promise<string> {
    const { activeUser } = ctx;
    if (!activeUser) throw new ApolloError("");
    if (lesson.lessonId) {
      const lessonItem = await this.lessonGService.getById(lesson.lessonId);
      if (lessonItem) return lessonItem.name;
    }
    return "";
  }
  @FieldResolver(() => Person, { nullable: true })
  async teacher(
    @Root() lesson: ILesson | Lesson,
    @Ctx() ctx: Context<CContext>
  ): Promise<Person | undefined> {
    const { activeUser } = ctx;
    if (!activeUser) throw new ApolloError("");
    if (lesson.teacherId) {
      return await this.personService.getById(lesson.teacherId);
    }
  }
}

Resolver();
export class LessonResolver {
  constructor(
    private readonly lessonService: LessonService,
    private readonly educationYearService: EducationYearService,
    private readonly weeklyHourService: WeeklyHourService,
    private readonly schoolService: SchoolService,
    private readonly weeklyScheduleService: WeeklyScheduleService
  ) {
    this.schoolService = Container.get(SchoolService);
    this.weeklyHourService = Container.get(WeeklyHourService);
    this.lessonService = Container.get(LessonService);
    this.weeklyScheduleService = Container.get(WeeklyScheduleService);
    this.educationYearService = Container.get(EducationYearService);
  }
  @Authorized(Role.ADMIN, Role.OWNER)
  @Query(() => [Lesson])
  async lessons(
    @Ctx() ctx: Context<CContext>,
    @Arg("data", () => LessonsInput) data: LessonsInput
  ): Promise<Lesson[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const { schoolId, classId, educationYearId } = data;
    const lessons = await this.lessonService.getManyByEducationYearId(
      new ObjectId(activeUser.teacher.institutionId),
      schoolId,
      classId,
      educationYearId
    );
    return lessons;
  }
  @Authorized(Role.STUDENT, Role.PARENT, Role.TEACHER)
  @Query(() => Lesson)
  async getLesson(
    @Ctx() ctx: Context<CContext>,
    @Arg("lessonId", () => ObjectIdScalar) lessonId: ObjectId
  ): Promise<Lesson> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const lesson = await this.lessonService.getById(activeUser, lessonId);
    if (lesson) {
      return lesson;
    }
    throw new ApolloError("lesson didn't find");
  }
  @Authorized(Role.ADMIN, Role.OWNER)
  @Mutation(() => Lesson)
  async addLesson(
    @Arg("lesson") lesson: LessonInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<Lesson> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const { schoolId, classId, _id, ...lessonData } = lesson;
    const lastEducationYear = await this.educationYearService.getLastEducationYear(
      new ObjectId(activeUser.teacher.institutionId),
      schoolId
    );
    if (!lastEducationYear) throw new ApolloError("Education year didn't find");
    if (!_id) {
      const newLessonData = {
        ...lessonData,
        institutionId: new ObjectId(activeUser.teacher.institutionId),
        educationYearId: lastEducationYear.id,
        schoolId,
        classId,
      };
      const newLesson = await this.lessonService.create(newLessonData);
      return newLesson;
    } else {
      const lesson = await this.lessonService.update(
        lessonData,
        new ObjectId(activeUser.teacher.institutionId),
        _id
      );
      if (lesson) return lesson;
    }
    throw new ApolloError("");
  }
  @Authorized(Role.ADMIN, Role.OWNER)
  @Mutation(() => RemoveResult)
  async removeLesson(
    @Arg("lessonId", () => ObjectIdScalar) lessonId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<RemoveResult> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const result = await this.lessonService.remove(
      new ObjectId(activeUser.teacher.institutionId),
      lessonId
    );
    return {
      code: "200",
      success: result,
      _id: result ? lessonId.toHexString() : "",
    };
  }
  @Authorized(Role.ADMIN, Role.OWNER)
  @Mutation(() => Lesson)
  async setLessonSchedule(
    @Arg("schedule") schedule: LessonScheduleInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<Lesson> {
    const { activeUser, dataloaders } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const { lessonId, ...scheduleData } = schedule;
    const lesson = await this.lessonService.getById(activeUser, lessonId);
    if (!lesson) throw new ApolloError("Lesson didn't find");
    const { schoolId } = lesson;
    if (lesson.weeklyHour === lesson.lessonWeeklySchedules.length)
      throw new ApolloError("the number of lessons reached its limit", "limit");
    if (lesson.teacherId) {
      const weeklyHour = await this.weeklyHourService.getById(
        new ObjectId(activeUser.teacher.institutionId),
        schoolId
      );
      const educationYear = await this.educationYearService.getLastEducationYear(
        new ObjectId(activeUser.teacher.institutionId),
        schoolId
      );
      if (!educationYear) throw new ApolloError("Eğitim yılı kayıtlı değil");
      if (!educationYear.isUpToDate())
        throw new ApolloError("Eğitim yılı güncel değil", "405");
      if (!weeklyHour)
        throw new ApolloError("no weekly schedule", "noSchedule");
      const hourOfLesson = weeklyHour.hour.find(
        (wh) => wh.code === schedule.hourCode
      );
      if (!hourOfLesson)
        throw new ApolloError(
          "this hour code is not include in the school weekly schedule",
          "noHour"
        );

      const teacherLessons = await this.lessonService.getManyIntersectionOfTeacherByDayAndHour(
        new ObjectId(activeUser.teacher.institutionId),
        hourOfLesson,
        lesson.teacherId,
        schedule.day
      );
      for (const tLesson of teacherLessons) {
        if (lesson) {
          let lessonG: LessonG | undefined;
          if (lesson.lessonId) {
            lessonG = await dataloaders.lessonGLoader.load(lesson.lessonId);
          }
          const school = await this.schoolService.getById(
            new ObjectId(activeUser.teacher.institutionId),
            tLesson.schoolId
          );
          const cl = school && school.classes.id(tLesson.classId);
          throw new ApolloError("Teacher has lesson on this timeline", "400", {
            schoolName: school?.name,
            schoolId: school?._id,
            className: `${cl?.level} ${cl?.code || ""} ${cl?.code1 || ""}`,
            classId: cl?._id,
            lessonName: lessonG ? lessonG.name : tLesson.name,
            lessonId: tLesson._id,
          });
        }
      }
    }
    const updatedLesson = await this.weeklyScheduleService.create(
      new ObjectId(activeUser.teacher.institutionId),
      scheduleData,
      lessonId
    );
    if (updatedLesson) return updatedLesson;
    throw new ApolloError("");
  }
  @Authorized(Role.ADMIN, Role.OWNER)
  @Mutation(() => Lesson)
  async removeScheduleToLesson(
    @Arg("lessonId", () => ObjectIdScalar) lessonId: ObjectId,
    @Arg("scheduleId", () => ObjectIdScalar) scheduleId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<Lesson> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const lesson = await this.lessonService.pullWeeklySchedule(
      new ObjectId(activeUser.teacher.institutionId),
      scheduleId,
      lessonId
    );
    if (lesson) return lesson;
    throw new ApolloError("");
  }
}
