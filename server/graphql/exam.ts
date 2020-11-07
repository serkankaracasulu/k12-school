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
  Authorized,
  FieldResolver,
  ResolverInterface,
  Root,
  PubSub,
  Publisher,
} from "type-graphql";
import {
  Context,
  ApolloError,
  ForbiddenError,
  AuthenticationError,
} from "apollo-server-core";
import { CContext, Topic } from "../types";
import { Exam, IExam } from "./../models/exam";
import { IsMongoId, IsDate } from "class-validator";
import { RemoveResult, ObjectIdScalar } from "./types";
import {
  StudentNotificationType,
  NotificationPalyload,
  StudentNotificationAction,
  INotification,
} from "./../models/studentNotification";
import { Grade } from "./../models/exam";
import { TermService } from "./../services/termServie";
import { Container } from "typedi";
import { ExamService } from "./../services/exam";
import { LessonService } from "./../services/lesson";
import { NotificationService } from "./../services/notification";
import { EducationYearService } from "./../services/educationYear";
import { StudentService } from "./../services/student";
import { Role } from "../models/person";
import { ObjectId } from "mongodb";

@InputType()
class ExamInput implements Partial<Exam> {
  @Field(() => ObjectIdScalar, { nullable: true })
  _id?: ObjectId;

  @Field(() => ObjectIdScalar)
  lessonId: ObjectId;

  @IsDate()
  @Field()
  date: Date;

  @Field(() => [Int])
  lessonHourCode: number[];
}

@Resolver(() => Exam)
export class ExamFieldResolver implements ResolverInterface<Exam> {
  constructor(private readonly termService: TermService) {
    this.termService = Container.get(TermService);
  }
  @FieldResolver(() => String)
  async termName(
    @Root() exam: IExam | Exam,
    @Ctx() ctx: Context<CContext>
  ): Promise<string> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.student) throw new AuthenticationError("");
    const term = await this.termService.getById(
      new ObjectId(activeUser.student.institutionId),
      new ObjectId(activeUser.student.schoolId),
      exam.educationYearId,
      exam.termId
    );
    if (term) term.name;
    return "";
  }
}

Resolver();
export class ExamResolver {
  constructor(
    private readonly examService: ExamService,
    private readonly lessonService: LessonService,
    private readonly notificationService: NotificationService,
    private readonly educationYearService: EducationYearService,
    private readonly studentService: StudentService
  ) {
    this.studentService = Container.get(StudentService);
    this.notificationService = Container.get(NotificationService);
    this.educationYearService = Container.get(EducationYearService);
    this.examService = Container.get(ExamService);
    this.lessonService = Container.get(LessonService);
  }
  @Authorized(Role.TEACHER)
  @Query(() => [Exam])
  async exams(
    @Arg("lessonId", () => ObjectIdScalar) lessonId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<Exam[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const lesson = await this.lessonService.getById(activeUser, lessonId);
    if (!lesson) throw new ApolloError("Lesson didn't find");
    if (!lesson.teacherId || lesson.teacherId.toHexString() !== activeUser?._id)
      throw new ForbiddenError("");
    return await this.examService.getManyForTeacher(
      new ObjectId(activeUser.teacher.institutionId),
      lessonId,
      lesson.educationYearId
    );
  }
  @Authorized(Role.STUDENT, Role.PARENT)
  @Query(() => [Exam])
  async myExams(
    @Arg("lessonId", () => ObjectIdScalar) lessonId: ObjectId,
    @Ctx() ctx: Context<CContext>,
    @Arg("parentStudentId", () => ObjectIdScalar, { nullable: true })
    parentStudentId: string
  ): Promise<Exam[]> {
    const { activeUser, requestParent } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    let studentId = new ObjectId(activeUser._id);
    if (activeUser.roles.includes(Role.PARENT) && requestParent) {
      studentId = new ObjectId(requestParent.studentId);
    }
    return await this.examService.getManyForStudent(
      new ObjectId(
        activeUser.teacher?.institutionId || requestParent?.institutionId
      ),
      lessonId,
      studentId
    );
  }
  @Authorized(Role.TEACHER)
  @Mutation(() => Grade)
  async setExamGrade(
    @Arg("examId", () => ObjectIdScalar) examId: ObjectId,
    @Arg("lessonId", () => ObjectIdScalar) lessonId: ObjectId,
    @Arg("grade", () => Int) grade: number,
    @Arg("studentId", () => ObjectIdScalar) studentId: ObjectId,
    @PubSub(Topic.studentNotificaion)
    publish: Publisher<NotificationPalyload>,
    @Ctx() ctx: Context<CContext>
  ): Promise<Grade> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    if (!activeUser) throw new AuthenticationError("");
    const lesson = await this.lessonService.getById(activeUser, lessonId);
    if (!lesson) throw new ApolloError("Lesson didn't find");
    const { schoolId, classId } = lesson;
    if (!lesson.teacherId || lesson.teacherId.toString() !== activeUser?._id)
      throw new ForbiddenError("");
    const updateGrade = await this.examService.updateGrade(
      examId,
      lessonId,
      studentId,
      grade
    );
    const newGrade =
      !updateGrade &&
      (await this.examService.addGrade(examId, lessonId, studentId, grade));

    if (newGrade || updateGrade) {
      const notification = await this.notificationService.create({
        lessonId,
        notificationType: StudentNotificationType.exam,
        personId: studentId,
        lessonName: lesson.name,
        createdAt: new Date(Date.now()),
      });
      await publish({
        ...notification,
        institutionId: new ObjectId(activeUser.teacher.institutionId),
        schoolId: schoolId,
        classId: classId,
        targetId: examId,
        studentId: new ObjectId(activeUser._id),
      });
    }
    if (updateGrade) return updateGrade;
    if (newGrade) return newGrade;
    throw new ApolloError("");
  }
  @Authorized(Role.TEACHER)
  @Mutation(() => Exam)
  async setExam(
    @Arg("data") data: ExamInput,
    @Ctx() ctx: Context<CContext>,
    @PubSub(Topic.studentNotificaion)
    publish: Publisher<NotificationPalyload>
  ): Promise<Exam> {
    const { activeUser, dataloaders } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const { _id, lessonId, ...rest } = data;
    const lesson = await dataloaders.lessonLoader.load(lessonId);
    if (!lesson) throw new ApolloError("Lesson didn't find");
    if (!lesson.teacherId || lesson.teacherId.toString() !== activeUser?._id)
      throw new ForbiddenError("");
    const educationYear = await this.educationYearService.getById(
      new ObjectId(activeUser.teacher.institutionId),
      lesson.schoolId,
      lesson.educationYearId
    );
    if (!educationYear) throw new ApolloError("Education year didn't find");
    const term = educationYear.getTermByDateRange(
      new Date(Date.now()),
      new Date(data.date)
    );
    if (!term) throw new ApolloError("There is no term this date range");
    let exam;
    if (_id) {
      exam = await this.examService.update(
        new ObjectId(activeUser.teacher.institutionId),
        _id,
        rest
      );
      if (!exam) throw new ApolloError("Exam didn't find");
      return exam;
    } else {
      exam = await this.examService.create({
        termId: term._id,
        institutionId: new ObjectId(activeUser.teacher.institutionId),
        educationYearId: educationYear._id,
        ...data,
      });
    }
    const students = await this.studentService.getByQuery({
      school: lesson.schoolId,
      class: lesson.classId,
    });
    const promiseNotifications: Promise<INotification>[] = [];
    const promiseList: Promise<void>[] = [];
    if (students) {
      for (const student of students) {
        const notification = this.notificationService.create(
          {
            lessonId,
            notificationType: StudentNotificationType.exam,
            personId: student._id,
            targetId: data._id,
            createdAt: new Date(Date.now()),
          },
          _id
            ? StudentNotificationAction.Update
            : StudentNotificationAction.Insert
        );
        promiseNotifications.push(notification);
      }
    }
    try {
      const notifications = await Promise.all(promiseNotifications);
      for (const iterator of notifications) {
        promiseList.push(
          publish({
            ...iterator,
            institutionId: new ObjectId(activeUser.teacher.institutionId),
            schoolId: lesson.schoolId,
            classId: lesson.classId,
          })
        );
        await Promise.all(promiseList);
      }
    } catch (error) {}
    return exam;
  }
  @Authorized(Role.TEACHER)
  @Mutation(() => RemoveResult)
  async deleteExam(
    @Arg("lessonId", () => ObjectIdScalar) lessonId: ObjectId,
    @Arg("examId", () => ObjectIdScalar) examId: ObjectId,
    @Ctx() ctx: Context<CContext>,
    @PubSub(Topic.studentNotificaion)
    publish: Publisher<NotificationPalyload>
  ): Promise<RemoveResult> {
    const { activeUser, dataloaders } = ctx;
    if (!activeUser || !activeUser.teacher) throw new ForbiddenError("");
    const lesson = await dataloaders.lessonLoader.load(lessonId);
    if (!lesson) throw new ApolloError("Lesson didn't find");
    if (!lesson.teacherId || lesson.teacherId.toHexString() !== activeUser?._id)
      throw new ForbiddenError("");
    const result = await this.examService.delete(
      new ObjectId(activeUser.teacher.institutionId),
      examId
    );
    if (result) {
      const studends = await this.studentService.getByQuery({
        school: lesson.schoolId,
        class: lesson.classId,
      });
      const promiseNotifications: Promise<INotification>[] = [];
      const promiseList: Promise<void>[] = [];
      if (studends) {
        for (const student of studends) {
          const notification = this.notificationService.create(
            {
              lessonId,
              notificationType: StudentNotificationType.exam,
              personId: student._id,
              targetId: examId,
              createdAt: new Date(Date.now()),
            },
            StudentNotificationAction.Delete
          );
          promiseNotifications.push(notification);
        }
      }
      try {
      } catch (error) {
        const notifications = await Promise.all(promiseNotifications);
        for (const notification of notifications) {
          promiseList.push(
            publish({
              ...notification,
              institutionId: new ObjectId(activeUser.teacher.institutionId),
              schoolId: lesson.schoolId,
              classId: lesson.classId,
            })
          );
        }
        await Promise.all(promiseList);
      }
    }
    return {
      code: "200",
      success: result,
      _id: result ? examId.toHexString() : "",
    };
  }
}
