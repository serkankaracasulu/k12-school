import {
  Resolver,
  Ctx,
  Arg,
  Int,
  Query,
  Authorized,
  Mutation,
  InputType,
  Field,
  ResolverInterface,
  FieldResolver,
  Root,
} from "type-graphql";
import { Context } from "apollo-server-core";
import { ClassG, ClassLesson, IClassLesson } from "../models/schoolGModel";
import { CContext } from "../types";
import { AuthenticationError } from "apollo-server-core";
import { ClassGService } from "./../services/classG";
import { Container } from "typedi";
import { IsInt } from "class-validator";
import { LessonGService } from "./../services/lessonG";
import { Role } from "../models/person";
import { ObjectIdScalar } from "./types";
import { ObjectId } from "mongodb";

@InputType()
class LessonToClassInput implements Partial<ClassLesson> {
  @Field(() => ObjectIdScalar)
  schoolId: ObjectId;

  @Field(() => ObjectIdScalar)
  classId: ObjectId;

  @Field(() => ObjectIdScalar)
  lessonId: ObjectId;

  @IsInt()
  @Field(() => Int)
  count: number;

  @Field({ nullable: true })
  required: boolean;
}

@Resolver(() => ClassLesson)
export class ClassLessonFieldResolver
  implements ResolverInterface<ClassLesson> {
  constructor(private readonly lessonGService: LessonGService) {
    this.lessonGService = Container.get(LessonGService);
  }

  @FieldResolver(() => Int)
  async lesson(@Root() lesson: ClassLesson, @Ctx() ctx: Context<CContext>) {
    const lessons = await this.lessonGService.getById(lesson.lessonId);
    return lessons?.toObject();
  }
}

Resolver();
export class ClassGResolver {
  constructor(private readonly classGService: ClassGService) {
    this.classGService = Container.get(ClassGService);
  }
  @Authorized(Role.OWNER, Role.ADMIN, Role.SUPER_ADMIN)
  @Query(() => ClassG)
  async classG(
    @Ctx() ctx: Context<CContext>,
    @Arg("schoolId", () => ObjectIdScalar) schoolId: ObjectId,
    @Arg("classId", () => ObjectIdScalar) classId: ObjectId
  ): Promise<ClassG> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const classG = await this.classGService.getById(schoolId, classId);
    return classG.toObject({ virtuals: true });
  }
  @Authorized(Role.SUPER_ADMIN)
  @Mutation(() => ClassG)
  async removeLessonToClass(
    @Arg("_id", () => ObjectIdScalar) _id: ObjectId,
    @Arg("schoolId", () => ObjectIdScalar) schoolId: ObjectId,
    @Arg("classId", () => ObjectIdScalar) classId: ObjectId
  ): Promise<ClassG> {
    const classG = await this.classGService.removeLessonById(
      schoolId,
      classId,
      _id
    );
    return classG.toObject({ virtuals: true });
  }
  @Authorized(Role.OWNER, Role.ADMIN, Role.SUPER_ADMIN)
  @Query(() => ClassG)
  async schoolKindClass(
    @Arg("schoolGId", () => ObjectIdScalar) schoolGId: ObjectId,
    @Arg("level", () => Int) level: number
  ): Promise<ClassG | null> {
    const classG = await this.classGService.getByLevel(schoolGId, level);
    return classG.toObject({ virtuals: true });
  }
  @Authorized(Role.SUPER_ADMIN)
  @Mutation(() => ClassG)
  async addLessonToClass(
    @Arg("data") data: LessonToClassInput
  ): Promise<ClassG> {
    const { classId, schoolId, ...lesson } = data;
    try {
      const classItem = await this.classGService.createLesson(
        schoolId,
        classId,
        lesson
      );
      return classItem.toObject({ virtuals: true });
    } catch (error) {
      throw error;
    }
  }
}
