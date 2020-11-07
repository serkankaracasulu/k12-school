/* eslint-disable no-unused-vars */

import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  Int,
  ID,
  Query,
  Authorized,
  PubSub,
  Publisher,
  Subscription,
  Root,
  ResolverFilterData,
  InputType,
  Field,
} from "type-graphql";
import { Upload, ObjectIdScalar } from "./types";

import {
  Context,
  AuthenticationError,
  ForbiddenError,
  ApolloError,
} from "apollo-server-core";
import { GraphQLUpload } from "graphql-upload";
import models from "../models";
import { HomeWork } from "./../models/homeWork";
import { createWriteStream, unlinkSync, existsSync, mkdirSync } from "fs";
import path = require("path");
import { CContext, Topic } from "../types";
import {
  Notification,
  NotificationPalyload,
} from "../models/studentNotification";
import { IsMongoId, MinLength, MaxLength } from "class-validator";
import { Student } from "./../models/student";
import { Lesson } from "../models/lessonGModel";
import { Role } from "../models/person";
import { ObjectId } from "mongodb";

@InputType()
class HomeWorkInput implements Partial<HomeWork> {
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
}

const { model } = models;
Resolver();
export class HomeWorkResolver {
  @Authorized(Role.TEACHER, Role.STUDENT)
  @Query(() => [HomeWork])
  async homeWorks(
    @Ctx() ctx: Context<CContext>,
    @Arg("lessonId", () => ID) lessonId: string,
    @Arg("skip", () => Int, { nullable: true }) skip: number = 0,
    @Arg("i", () => ID, { nullable: true }) i: string
  ): Promise<HomeWork[] | null> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId) return null;
    return await model.HomeWork.find({
      lessonId: lessonId,
      institutionId: activeUser.teacher.institutionId,
    })
      .limit(10)
      .skip(skip)
      .sort({ sent: -1 });
  }
  @Authorized("TEACHER")
  @Mutation(() => HomeWork)
  async sendHomeWork(
    @Ctx() ctx: Context<CContext>,
    @Arg("data", () => HomeWorkInput) data: HomeWorkInput,
    @PubSub(Topic.studentNotificaion)
    publish: Publisher<NotificationPalyload>,
    @Arg("homeWorkFile", () => GraphQLUpload, { nullable: true })
    homeWorkFile?: Promise<Upload>
  ): Promise<HomeWork> {
    const { activeUser, dataloaders } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const { lessonId, title, message } = data;
    const lesson = await dataloaders.lessonLoader.load(lessonId);
    if (!lesson) throw new ApolloError("lesson didn't find");
    if (!lesson.teacherId || lesson.teacherId.toString() !== activeUser._id)
      throw new ForbiddenError("");
    const { schoolId, classId } = lesson;
    const newHomeWorkDoc = new HomeWork(
      new ObjectId(activeUser.teacher.institutionId),
      lessonId,
      title,
      message
    );
    const newHomeWork = new model.HomeWork(newHomeWorkDoc);
    const lessonG = lesson.lessonId && (await Lesson.findById(lesson.lessonId));
    if (homeWorkFile) {
      const homeWorkPath = path.join(
        activeUser.teacher.institutionId,
        schoolId.toHexString(),
        classId.toHexString(),
        lessonId.toHexString(),
        "homework",
        newHomeWork.id
      );
      const { createReadStream, filename } = await homeWorkFile;
      const homeWorkFullPath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "private",
        "files",
        homeWorkPath
      );
      if (!existsSync(homeWorkFullPath)) {
        mkdirSync(homeWorkFullPath, { recursive: true });
      }
      newHomeWork.file = filename;
      const write = createWriteStream(path.join(homeWorkFullPath, filename));
      var size = 0;
      await new Promise((res, rej) => {
        var readStream = createReadStream();
        readStream
          .on("open", function () {
            readStream.pipe(write);
          })
          .on("data", function (chunk) {
            size += chunk.length;
            if (size > 150000000) {
              if (existsSync(path.join(homeWorkFullPath, filename))) {
                unlinkSync(path.join(homeWorkFullPath, filename));
              }
              rej("oversize");
            }
          })
          .on("close", res)
          .on("error", rej);
      });
    }

    try {
      await newHomeWork.save();
    } catch (error) {
      throw error;
    }
    return newHomeWork;
  }
  @Authorized("STUDENT")
  @Subscription({
    topics: Topic.studentNotificaion,
    filter: ({
      payload,
      context,
    }: ResolverFilterData<NotificationPalyload, void, CContext>) => {
      if (!context.activeUser) return false;
      return (
        context !== undefined &&
        payload.schoolId !== undefined &&
        payload.classId !== undefined &&
        payload.institutionId.toHexString() ===
          context.activeUser.student?.institutionId &&
        payload.schoolId.toHexString() ===
          context.activeUser.student.schoolId &&
        payload.classId.toHexString() === context.activeUser.student.classId &&
        ((payload.studentId !== undefined &&
          payload.studentId.toHexString() === context.activeUser._id) ||
          payload.studentId === undefined)
      );
    },
  })
  studentNotificationUpdated(
    @Root() notificationPayload: NotificationPalyload
  ): Notification {
    return notificationPayload;
  }
}
