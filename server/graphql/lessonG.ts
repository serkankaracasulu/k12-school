/* eslint-disable no-unused-vars */

import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  InputType,
  Field,
  ID,
  Query,
  Authorized,
  ResolverInterface,
  Root,
  FieldResolver,
} from "type-graphql";
import { RemoveResult, ObjectIdScalar } from "./types";
import { Context, AuthenticationError } from "apollo-server-core";
import { LessonG, ILessonG } from "./../models/lessonGModel";
import { CContext } from "../types";
import { TeacherField } from "./../models/teacherField";
import { TeacherFieldService } from "./../services/teacherField";
import { Container } from "typedi";
import { Length, IsMongoId, ArrayUnique } from "class-validator";
import { LessonGService } from "./../services/lessonG";
import { ClassGService } from "./../services/classG";
import { Role } from "../models/person";
import { ObjectId } from "mongodb";

@InputType()
class LessonCreateInput implements Partial<LessonG> {
  @Length(2, 255)
  @Field()
  name: string;

  @ArrayUnique()
  @Field(() => [ObjectIdScalar])
  teacherFieldIds: ObjectId[];
}

@InputType()
class LessonGInput implements Partial<LessonG> {
  @Field(() => ObjectIdScalar)
  _id: ILessonG["_id"];

  @Length(2, 255)
  @Field({ nullable: true })
  name?: string;

  @ArrayUnique()
  @Field(() => [ObjectIdScalar])
  teacherFieldIds: ObjectId[];
}

@Resolver(() => LessonG)
export class LessonGFieldResolver implements ResolverInterface<LessonG> {
  constructor(private readonly teacherFieldService: TeacherFieldService) {
    this.teacherFieldService = Container.get(TeacherFieldService);
  }
  @FieldResolver(() => [TeacherField])
  async teacherFields(
    @Root() lesson: ILessonG | LessonG,
    @Ctx() ctx: Context<CContext>
  ) {
    return await this.teacherFieldService.getManyByIds(lesson.teacherFieldIds);
  }
}

@Resolver()
export class LessonGResolver {
  constructor(
    private readonly lessonGService: LessonGService,
    private readonly classGService: ClassGService
  ) {
    this.lessonGService = Container.get(LessonGService);
    this.classGService = Container.get(ClassGService);
  }

  @Authorized(
    Role.ADMIN,
    Role.OWNER,
    Role.SUPER_ADMIN,
    Role.TEACHER,
    Role.STUDENT
  )
  @Query(() => [LessonG])
  async lessonsG(@Ctx() ctx: Context<CContext>): Promise<LessonG[]> {
    return await this.lessonGService.getAll();
  }
  @Authorized(Role.SUPER_ADMIN)
  @Mutation(() => LessonG)
  async createLessonG(
    @Arg("lesson") lesson: LessonCreateInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<LessonG> {
    try {
      return await this.lessonGService.create(lesson);
    } catch (error) {
      throw error;
    }
  }
  @Authorized(Role.SUPER_ADMIN)
  @Mutation(() => LessonG)
  async editLessonG(
    @Arg("lesson") lesson: LessonGInput
  ): Promise<LessonG | null> {
    return await this.lessonGService.update(lesson, lesson._id);
  }
  @Authorized(Role.SUPER_ADMIN)
  @Mutation(() => RemoveResult)
  async removeLessonG(
    @Arg("_id", () => ObjectIdScalar) _id: ObjectId
  ): Promise<RemoveResult> {
    const result = await this.lessonGService.remove(_id);
    if (result) {
      await this.classGService.removeLessonsById(_id);
    }
    return {
      code: "200",
      success: result,
      _id: result ? _id.toHexString() : "",
    };
  }
  @Authorized(Role.SUPER_ADMIN)
  @Mutation(() => LessonG)
  async addTeacherFieldsToLesson(
    @Arg("ids", () => [ObjectIdScalar]) ids: ObjectId[],
    @Arg("_id", () => ObjectIdScalar) _id: ObjectId
  ): Promise<LessonG | null> {
    return await this.lessonGService.createTeacherField(_id, ids);
  }
}
