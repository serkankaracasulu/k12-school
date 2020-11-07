import { Service } from "typedi";
import { ApplicationService } from "./application";
import {
  DriverApplicationModel,
  DriverApplication,
} from "./../models/driverApplication";
import { ObjectId } from "mongodb";
import { CreateType } from "../types";

@Service()
export class DriverApplicationService extends ApplicationService {
  private readonly driverApplicationModel = DriverApplicationModel;
  async createMany(data: CreateType<DriverApplication>[]) {
    const app = await this.driverApplicationModel.find(
      {
        email: { $in: data.map((d) => d.email) },
      },
      { email: 1 }
    );
    const fData = data.filter((d) => !app.some((a) => a.email === d.email));
    const result = await this.driverApplicationModel.insertMany(fData, {
      ordered: false,
    });
    return result;
  }
  async getAllOfInst(instId: ObjectId) {
    return await this.driverApplicationModel.find({ institutionId: instId });
  }
  async getManyByUserId(userId: ObjectId) {
    const cond: Partial<DriverApplication> = { userId };
    return await this.driverApplicationModel.find(cond);
  }
}
