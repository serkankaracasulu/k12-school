/* eslint-disable no-unused-vars */

import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  ID,
  Query,
  Authorized,
  InputType,
  Field,
  ResolverInterface,
  FieldResolver,
  Root,
} from "type-graphql";
import { RemoveResult, ObjectIdScalar } from "./types";
import { Context } from "apollo-server-core";
import { Length } from "class-validator";
import { TeacherField, ITeacherField } from "./../models/teacherField";
import { CContext } from "../types";
import { TeacherFieldService } from "./../services/teacherField";
import { Container } from "typedi";
import { Department, IDepartment } from "./../models/department";
import { DepartmentService } from "../services/department";
import { Role } from "../models/person";
import { ObjectId } from "mongodb";

@InputType()
class TeacherFieldInput implements Partial<TeacherField> {
  @Length(3, 255)
  @Field()
  name: string;
}
@Resolver(() => TeacherField)
export class TeacherFieldFieldResolver
  implements ResolverInterface<TeacherField> {
  constructor(private readonly departmentService: DepartmentService) {
    this.departmentService = Container.get(DepartmentService);
  }
  @FieldResolver(() => [Department])
  async departments(@Root() teacherField: ITeacherField | TeacherField) {
    return await this.departmentService.getAllByIds(teacherField.departmentIds);
  }
}

Resolver();
export class TeacherFieldResolver {
  constructor(private readonly teacherFieldService: TeacherFieldService) {
    this.teacherFieldService = Container.get(TeacherFieldService);
  }

  @Authorized(Role.SUPER_ADMIN)
  @Mutation(() => TeacherField)
  async addDepartmentsToTeacherField(
    @Arg("ids", () => [ObjectIdScalar]) ids: ObjectId[],
    @Arg("_id", () => ObjectIdScalar) _id: ObjectId
  ): Promise<TeacherField | null> {
    return await this.teacherFieldService.addDepartments(_id, ids);
  }
  @Authorized(Role.SUPER_ADMIN)
  @Mutation(() => TeacherField)
  async removeDepartmentsToTeacherField(
    @Arg("id", () => ObjectIdScalar) id: ObjectId,
    @Arg("_id", () => ObjectIdScalar) _id: ObjectId
  ): Promise<TeacherField | null> {
    return await this.teacherFieldService.removeDepartment(_id, id);
  }
  @Authorized(Role.SUPER_ADMIN, Role.OWNER, Role.ADMIN)
  @Query(() => [TeacherField])
  async teacherFields(@Ctx() ctx: Context<CContext>): Promise<TeacherField[]> {
    return await this.teacherFieldService.getAll();
  }
  @Authorized(Role.SUPER_ADMIN)
  @Mutation(() => TeacherField)
  async editTeacherField(
    @Arg("data", () => TeacherFieldInput) data: TeacherFieldInput
  ): Promise<TeacherField> {
    const { name } = data;
    try {
      return await this.teacherFieldService.create(name);
    } catch (error) {
      throw error;
    }
  }
  @Authorized(Role.SUPER_ADMIN)
  @Mutation(() => RemoveResult)
  async removeTeacherField(
    @Arg("_id", () => ObjectIdScalar) _id: ObjectId
  ): Promise<RemoveResult> {
    let result = false;
    try {
      result = await this.teacherFieldService.remove(_id);
    } catch (error) {
      throw error;
    }
    return { code: "200", success: result, _id: _id.toHexString() };
  }
}
