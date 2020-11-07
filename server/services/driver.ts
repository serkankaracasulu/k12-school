import { Service } from "typedi";
import { DriverInstitution } from "./../models/driver";
import { PersonService } from "./person";
import { ObjectId } from "mongodb";
import { CreateType } from "../types";
import { UserModel } from "../models/user";

@Service()
export class DriverService extends PersonService {
  private readonly userModel = UserModel;
  async getManyByInstId(instId: ObjectId) {
    return await this.userModel.find({
      "driver.institutions.institutionId": instId,
    });
  }
  async getByDriverId(driverId: ObjectId) {
    return await this.userModel.findOne({ "driver._id": driverId });
  }
  async remove(driverId: ObjectId, instId: ObjectId) {
    const result = await this.userModel.updateOne(
      { _id: driverId },
      { $pull: { "driver.institutions.institutionId": instId } }
    );
    if (result.n === 1) return false;
    if (result.ok === 1 && result.nModified === 1) return true;
    return false;
  }

  async addInst(instId: ObjectId, personId: ObjectId) {
    const driverInst: CreateType<DriverInstitution> = {
      institutionId: instId,
    };
    const result = await this.userModel.updateOne(
      {
        _id: personId,
        driver: { $exists: true },
        "driver.institutions": { $nin: instId },
      },
      { $push: { "driver.institutions": driverInst } }
    );
    if (!result.n) throw Error("User didn't find");
    if (result.ok && result.nModified) return true;
    return false;
  }

  async getDriversOfStudent(studentId: ObjectId, instId: ObjectId) {
    return await this.userModel.find({
      "driver.institutions": {
        $elemMatch: { institutionId: instId, studentIds: { $in: studentId } },
      },
    });
  }
  async addStudent(driverId: ObjectId, studentId: ObjectId, instId: ObjectId) {
    const result = await this.userModel.updateOne(
      { _id: driverId },
      { $addToSet: { "driver.institutions.$[inst].studentIds": studentId } },
      { arrayFilters: [{ "inst.institutionId": instId }] }
    );
    if (!result.n) throw new Error("Driver didn' t find");
    if (result.nModified && result.ok) return true;
    return false;
  }
  async removeStudent(
    driverId: ObjectId,
    studentId: ObjectId,
    institutionId: ObjectId
  ) {
    const result = await this.userModel.updateOne(
      { _id: driverId },
      { $pull: { "driver.institutions.$[inst].studentIds": studentId } },
      { arrayFilters: [{ "inst.institutionId": institutionId }] }
    );
    if (result.n) return true;
    return false;
  }
}
