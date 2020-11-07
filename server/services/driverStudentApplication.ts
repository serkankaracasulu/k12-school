import { Service } from "typedi";
import { ApplicationService } from "./application";
import { ObjectId } from "mongodb";
import {
  DriverStudentApplicationModel,
  DriverStudentApplication,
} from "./../models/driverStudentApplication";
import { CreateType } from "../types";
import { Application } from "../models/application";

@Service()
export class DriverStudentApplicationService extends ApplicationService {
  private readonly driverStudentApplicationModel = DriverStudentApplicationModel;
  async create(
    data: CreateType<DriverStudentApplication>,
    studentId: ObjectId
  ) {
    const app = await this.driverStudentApplicationModel.findOne({
      driverId: data.driverId,
      userId: studentId,
    });
    if (app) throw new Error("Invitation already sended");
    try {
      return await new this.driverStudentApplicationModel({
        ...data,
        userId: studentId,
      }).save();
    } catch (error) {
      throw error;
    }
  }
  async getManyByDriverId(driverId: ObjectId) {
    return await this.driverStudentApplicationModel.find({
      driverId,
      status: { $lt: 2 },
    });
  }
  async removeByDriverId(driverId: ObjectId, applicationId: ObjectId) {
    const result = await this.driverStudentApplicationModel.findOneAndDelete({
      driverId,
      _id: applicationId,
    });
    if (result) return result;
  }
  async acceptByDriverId(driverId: ObjectId, applicationId: ObjectId) {
    const result = await this.driverStudentApplicationModel.updateOne(
      {
        driverId,
        _id: applicationId,
      },
      { status: 2 }
    );
    if (result.nModified) return true;
    if (!result.n) throw new Error("Applicaiton didn't find");
    return false;
  }
  async getByDriverId(applicationId: ObjectId, driverId: ObjectId) {
    const app = await this.driverStudentApplicationModel.findOne({
      _id: applicationId,
      driverId,
    });
    if (app) return app;
    else return null;
  }
  async getManyByUserId(userId: ObjectId) {
    return await this.driverStudentApplicationModel.find({
      userId,
    });
  }
  async getByDriverAndUserId(driverId: ObjectId, userId: ObjectId) {
    const app = await this.driverStudentApplicationModel.findOne({
      driverId,
      userId,
    });
    if (app) return app;
    else return null;
  }
  async removeMine(id: ObjectId, userId: ObjectId) {
    const cond: Partial<Application> = {
      _id: id,
      userId,
    };
    const application = await this.driverStudentApplicationModel.findOneAndDelete(
      cond
    );
    return application;
  }
}
