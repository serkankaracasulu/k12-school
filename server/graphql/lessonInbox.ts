/* eslint-disable no-unused-vars */

import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  Int,
  Query,
  Authorized,
  PubSub,
  Publisher,
  InputType,
  Field,
} from "type-graphql";
import {
  Context,
  AuthenticationError,
  ApolloError,
  ForbiddenError,
} from "apollo-server-core";
import { GraphQLUpload } from "graphql-upload";
import { LessonInbox, LessonMessageType } from "./../models/lessonInbox";
import { CContext, Topic } from "../types";
import {
  StudentNotificationType,
  NotificationPalyload,
} from "../models/studentNotification";
import { IsMongoId, MinLength, MaxLength } from "class-validator";
import { Upload, ObjectIdScalar } from "./types";
import { LessonInboxService } from "./../services/lessonInbox";
import { Container } from "typedi";
import { NotificationService } from "./../services/notification";
import { StudentService } from "./../services/student";
import { Role } from "../models/person";
import { ObjectId } from "mongodb";

@InputType()
class LessonMessageInput implements Partial<LessonInbox> {
  @Field(() => ObjectIdScalar)
  lessonId: ObjectId;

  @MaxLength(60)
  @MinLength(3)
  @Field()
  title: string;

  @MaxLength(500)
  @MinLength(1)
  @Field()
  message: string;

  @Field(() => LessonMessageType)
  messageType: LessonMessageType;
}

Resolver();
export class LessonInboxResolver {
  constructor(
    private readonly lessonInboxService: LessonInboxService,
    private readonly notificationService: NotificationService,
    private readonly studentService: StudentService
  ) {
    this.studentService = Container.get(StudentService);
    this.lessonInboxService = Container.get(LessonInboxService);
    this.notificationService = Container.get(NotificationService);
  }
  @Authorized(Role.TEACHER, Role.STUDENT, Role.PARENT)
  @Query(() => [LessonInbox])
  async lessonMessages(
    @Ctx() ctx: Context<CContext>,
    @Arg("lessonId", () => ObjectIdScalar) lessonId: ObjectId,
    @Arg("skip", () => Int, { nullable: true }) skip: number = 0,
    @Arg("parentStudentId", () => ObjectIdScalar, { nullable: true })
    parentStudentId?: ObjectId
  ): Promise<LessonInbox[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    return await this.lessonInboxService.getManyByLessonId(
      lessonId,
      new ObjectId(activeUser.teacher.institutionId),
      skip
    );
  }
  @Authorized(Role.TEACHER)
  @Mutation(() => LessonInbox)
  async sendLessonMessage(
    @Ctx() ctx: Context<CContext>,
    @Arg("data", () => LessonMessageInput) data: LessonMessageInput,
    @PubSub(Topic.studentNotificaion)
    publish: Publisher<NotificationPalyload>,
    @Arg("file", () => GraphQLUpload, { nullable: true })
    file?: Promise<Upload>
  ): Promise<LessonInbox> {
    const { activeUser, dataloaders } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const { lessonId, messageType } = data;
    const lesson = await dataloaders.lessonLoader.load(lessonId);
    if (!lesson) throw new ApolloError("lesson didn't find");
    if (!lesson.teacherId || lesson.teacherId.toString() !== activeUser._id)
      throw new ForbiddenError("");
    const { schoolId, classId } = lesson;
    try {
      const newMesssage = await this.lessonInboxService.create({
        ...data,
        institutionId: new ObjectId(activeUser.teacher.institutionId),
        teacherId: new ObjectId(activeUser._id),
      });
      const students = await this.studentService.getByQuery({
        school: lesson.schoolId,
        class: lesson.classId,
      });
      if (students) {
        const notifications = await this.notificationService.createMany(
          {
            lessonId,
            notificationType: StudentNotificationType[messageType],
            createdAt: new Date(Date.now()),
          },
          students.map((s) => s.id)
        );
        const promiseList: Promise<void>[] = [];
        for (const notification of notifications) {
          promiseList.push(
            publish({
              ...notification,
              institutionId: new ObjectId(activeUser.teacher.institutionId),
              schoolId: schoolId,
              classId: classId,
            })
          );
        }
        await Promise.all(promiseList);
      }
      return newMesssage;
    } catch (error) {
      throw error;
    }
  }
}
