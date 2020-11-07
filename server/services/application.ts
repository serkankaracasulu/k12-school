import { Service } from "typedi";
import { ApplicationModel, Application } from "./../models/application";
import { ObjectId } from "mongodb";

@Service()
export class ApplicationService {
  private readonly applicationModel = ApplicationModel;
  async updateStatusByEmail(
    status: number,
    id: ObjectId,
    email: string,
    userId: ObjectId
  ) {
    const applicationCon: Partial<Application> = {
      _id: id,
      email: email,
    };
    const applicationDoc: Partial<Application> = {
      status: status,
      userId,
    };
    const result = await this.applicationModel.updateOne(
      applicationCon,
      applicationDoc
    );
    if (result.n === 1 && result.ok === 1 && result.nModified === 1) {
      return true;
    }
    return false;
  }
  async updateStatusByUserId(id: ObjectId, userId: ObjectId, status: number) {
    return await this.applicationModel.findOneAndUpdate(
      { _id: id, userId: userId },
      { status },
      { new: true }
    );
  }
  async remove(instId: ObjectId, id: ObjectId) {
    const cond: Partial<Application> = {
      institutionId: instId,
      _id: id,
    };
    const application = await this.applicationModel.findOneAndDelete(cond);
    return application;
  }
  async removeMine(id: ObjectId, userId: ObjectId) {
    const cond: Partial<Application> = {
      _id: id,
      userId,
    };
    const application = await this.applicationModel.findOneAndDelete(cond);
    return application;
  }
  async getById(instId: ObjectId, id: ObjectId) {
    return this.applicationModel.findOne({
      institutionId: instId,
      _id: id,
    });
  }
}
