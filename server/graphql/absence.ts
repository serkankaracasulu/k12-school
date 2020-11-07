/* eslint-disable no-unused-vars */
import {
  Resolver,
  Ctx,
  Arg,
  InputType,
  Field,
  Int,
  Authorized,
  Mutation,
  PubSub,
  Publisher,
  Query,
} from "type-graphql";
import { Context, ApolloError, AuthenticationError } from "apollo-server-core";
import { CContext, Topic } from "../types";
import { IsMongoId, ArrayUnique } from "class-validator";
import { Absence, IAbsence } from "../models/absence";
import { ForbiddenError } from "apollo-server";
import { RemoveResult, ObjectIdScalar } from "./types";
import {
  NotificationPalyload,
  StudentNotificationType,
} from "../models/studentNotification";
import { AbsenceService } from "./../services/absence";
import { Container } from "typedi";
import { StudentService } from "./../services/student";
import { HourService } from "./../services/hour";
import { LessonService } from "./../services/lesson";
import { LessonGService } from "./../services/lessonG";
import { NotificationService } from "./../services/notification";
import { Role } from "../models/person";
import { ObjectId } from "mongodb";

@InputType()
class AbsenceInput implements Partial<Absence> {
  @ArrayUnique()
  @Field(() => [ObjectIdScalar])
  studentIds: ObjectId[];

  @Field(() => ObjectIdScalar)
  lessonId: ObjectId;

  @Field(() => Int)
  hourCode: number;
}

@InputType()
class AbsencesInput {
  @Field({ nullable: true, description: "active term" })
  t?: boolean;
}

@Resolver()
export class AbsenceResolver {
  constructor(
    private readonly absenceService: AbsenceService,
    private readonly studentService: StudentService,
    private readonly hourService: HourService,
    private readonly lessonService: LessonService,
    private readonly lessonGService: LessonGService,
    private readonly notificationService: NotificationService
  ) {
    this.notificationService = Container.get(NotificationService);
    this.lessonGService = Container.get(LessonGService);
    this.lessonService = Container.get(LessonService);
    this.hourService = Container.get(HourService);
    this.studentService = Container.get(StudentService);
    this.absenceService = Container.get(AbsenceService);
  }
  @Authorized(Role.TEACHER, Role.STUDENT)
  @Query(() => [Absence])
  async absences(
    @Arg("query", () => AbsencesInput) query: AbsencesInput,
    @Ctx() ctx: Context<CContext>,
    @Arg("parentStudentId", () => ObjectIdScalar, { nullable: true })
    parentStudentId?: ObjectId
  ): Promise<Absence[]> {
    const { activeUser, requestParent } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const { t } = query;
    let studentId: ObjectId | null = null;
    let schoolId: ObjectId | null = null;
    let instId: ObjectId | null = null;
    const isParent = activeUser.roles.includes(Role.PARENT);
    const isStudent = activeUser.roles.includes(Role.STUDENT);
    if (isStudent && activeUser.student?.schoolId) {
      studentId = new ObjectId(activeUser._id);
      schoolId = new ObjectId(activeUser.student.schoolId);
      instId = new ObjectId(activeUser.student.institutionId);
    }
    if (isParent && requestParent) {
      const student = await this.studentService.getStudentById(
        new ObjectId(requestParent.studentId)
      );
      if (!student) throw new ApolloError("Student didn't find");
      instId = student.institutionId;
      schoolId = new ObjectId(student.school);
      studentId = new ObjectId(student.institutionId);
    }
    if (!schoolId || !studentId || !instId)
      throw new Error("schoolId,studentId");
    if (t) {
      if (isParent || isStudent)
        return await this.absenceService.getForStudentInThisTerm(
          studentId,
          instId,
          schoolId
        );
    } else {
      if (activeUser.roles.includes(Role.TEACHER)) {
        return await this.absenceService.getForTeacher(
          new ObjectId(activeUser._id)
        );
      } else
        return await this.absenceService.getForStudentInThisWeek(
          new ObjectId(studentId)
        );
    }
    throw new ForbiddenError("");
  }
  @Authorized(Role.TEACHER)
  @Mutation(() => RemoveResult)
  async deleteAbsence(
    @Arg("absenceId", () => ObjectIdScalar) absenceId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<RemoveResult> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const result = await this.absenceService.remove(
      absenceId,
      new ObjectId(activeUser._id)
    );
    if (result)
      return { success: true, code: "200", _id: absenceId.toHexString() };
    throw new ApolloError("Absence didnt find");
  }
  @Authorized(Role.TEACHER)
  @Mutation(() => [Absence])
  async createAbsence(
    @Arg("data", () => AbsenceInput) data: AbsenceInput,
    @Ctx() ctx: Context<CContext>,
    @PubSub(Topic.studentNotificaion)
    publish: Publisher<NotificationPalyload>
  ): Promise<Absence[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const lesson = await this.lessonService.getById(activeUser, data.lessonId);
    if (!lesson) throw new ApolloError("lesson didn't find");
    if (!lesson.teacherId || lesson.teacherId.toString() !== activeUser._id)
      throw new ForbiddenError("");
    const { schoolId, classId } = lesson;
    const students = await this.studentService.getStudentManyById(
      data.studentIds
    );
    const hour = await this.hourService.getByCode(
      new ObjectId(activeUser.teacher.institutionId),
      schoolId,
      data.hourCode
    );
    if (!hour) throw new ApolloError("weeklyHour didn't find");
    const promiseList: Promise<IAbsence>[] = [];
    for (const student of students) {
      if (student && !(student instanceof Error))
        if (
          student &&
          !(student instanceof Error) &&
          student.school &&
          student.school.equals(lesson.schoolId) &&
          student.class &&
          student.class.equals(lesson.classId)
        ) {
          const newAbsence = this.absenceService.create(
            hour,
            lesson,
            student._id
          );
          promiseList.push(newAbsence);
        }
    }

    let absenceList: IAbsence[] = [];
    try {
      absenceList = await Promise.all(promiseList);
    } catch (error) {
      throw error;
    }
    for (const absence of absenceList) {
      const lessonG =
        lesson.lessonId && (await this.lessonGService.getById(lesson.lessonId));
      const lessonName = lesson.name || lessonG?.name || "";
      const notification = await this.notificationService.create({
        lessonId: absence.lessonId,
        notificationType: StudentNotificationType.absence,
        personId: absence.studentId,
        lessonName,
        targetId: absence._id,
        createdAt: new Date(Date.now()),
      });
      publish({
        ...notification,
        institutionId: new ObjectId(activeUser.teacher.institutionId),
        schoolId: schoolId,
        classId: classId,
      });
    }
    return absenceList;
  }
}
