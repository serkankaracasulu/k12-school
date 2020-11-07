import { Service } from "typedi";
import { ApplicationService } from "./application";
import {
  ParentApplicationModel,
  ParentApplication,
  IParentApplication,
} from "./../models/parentApplication";
import { CreateType } from "../types";
import { ObjectId } from "mongodb";

@Service()
export class ParentApplicationService extends ApplicationService {
  private readonly parentApplicationModel = ParentApplicationModel;
  async create(data: CreateType<ParentApplication>) {
    const application = await new this.parentApplicationModel(data).save();
    return application;
  }
  async getManyByStudentId(studentId: ObjectId): Promise<IParentApplication[]> {
    const application = await this.parentApplicationModel.find({
      studentId,
    });
    return application.map((a) => a.toObject({ virtuals: true }));
  }
  async getManyByUserId(userId: ObjectId): Promise<IParentApplication[]> {
    const applications = await this.parentApplicationModel.find({ userId });
    return applications.map((a) => a.toObject({ virtuals: true }));
  }
  async getParentApplicationById(
    applicationId: ObjectId
  ): Promise<ParentApplication | null> {
    const application = await this.parentApplicationModel.findOne({
      _id: applicationId,
    });
    if (application) return application.toObject({ virtuals: true });
    return null;
  }
}
