/* eslint-disable no-unused-vars */

import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  InputType,
  Field,
  Query,
  Authorized,
} from "type-graphql";
import { RemoveResult, ObjectIdScalar } from "./types";
import { Context } from "apollo-server-core";
import { Department } from "./../models/department";
import { CContext } from "../types";
import { AuthenticationError } from "apollo-server-core";
import { Length } from "class-validator";
import { DepartmentService } from "./../services/department";
import { Container } from "typedi";
import { TeacherFieldService } from "./../services/teacherField";
import { Role } from "../models/person";
import { ObjectId } from "mongodb";

@InputType()
class DepartmentInput implements Partial<Department> {
  @Length(3, 255)
  @Field()
  name: string;
}

Resolver();
export class DepartmentResolver {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly teacherFieldService: TeacherFieldService
  ) {
    this.departmentService = Container.get(DepartmentService);
    this.teacherFieldService = Container.get(TeacherFieldService);
  }
  @Authorized(Role.SUPER_ADMIN)
  @Mutation(() => Department)
  async editDepartment(
    @Arg("department") department: DepartmentInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<Department | null> {
    return await this.departmentService.create(department);
  }
  @Mutation(() => RemoveResult)
  async removeDepartment(
    @Arg("_id", () => ObjectIdScalar) _id: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<RemoveResult> {
    const result = await this.departmentService.remove(_id);
    if (result) {
      await this.teacherFieldService.removeAllDepartments(_id);
    }
    return {
      code: "200",
      success: result,
      _id: result ? _id.toHexString() : "",
    };
  }
  @Authorized()
  @Query(() => [Department])
  async departments(@Ctx() ctx: Context<CContext>): Promise<Department[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return await this.departmentService.getAll();
  }
}
