import { Service } from "typedi";
import { TeacherApplication } from "../models/teacherApplication";
import { TeacherApplicationModel } from "./../models/teacherApplication";
import { ApplicationService } from "./application";
import { ObjectId } from "mongodb";
import { CreateType } from "../types";

@Service()
export class TeacherApplicationService extends ApplicationService {
  private readonly teacherApplicationModel = TeacherApplicationModel;
  async createMany(data: CreateType<TeacherApplication>[]) {
    const app = await this.teacherApplicationModel.find(
      {
        email: { $in: data.map((d) => d.email) },
      },
      { email: 1 }
    );
    const fData = data.filter((d) => !app.some((a) => a.email === d.email));
    const result = await this.teacherApplicationModel.insertMany(fData, {
      ordered: false,
    });
    return result;
  }
  async getAllOfInst(instId: ObjectId) {
    const cond: Partial<TeacherApplication> = {
      institutionId: instId,
    };
    return this.teacherApplicationModel.find(cond);
  }
  async getManyByUserId(userId: ObjectId) {
    const cond: Partial<TeacherApplication> = { userId };
    return await this.teacherApplicationModel.find(cond);
  }
}
