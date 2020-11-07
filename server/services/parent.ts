import { Service } from "typedi";
import { ParentStudent } from "./../models/parent";
import { PersonService } from "./person";
import { UserModel, User, IUser } from "../models/user";
import { TokenModel } from "./../models/user";
import { ObjectId } from "mongodb";
import { Person, PersonKind, IPerson } from "../models/person";
import { CreateType } from "../types";
import generatePassword from "./../helper/generatePassword";

@Service()
export class ParentService extends PersonService {
  private readonly userModel = UserModel;
  constructor() {
    super();
  }
  async getByCitizenshipId(institutionId: ObjectId, citizenshipId: string) {
    return await this.userModel.findOne({
      citizenshipId,
      "parentStudents.institutionId": institutionId,
    });
  }
  async getParentById(instId: ObjectId, id: ObjectId) {
    return await this.userModel.findOne({
      _id: id,
      "parentStudents.institutionId": instId,
    });
  }
  async getParentByTCandUnVEmail(citizenshipId: string, email: string) {
    return await this.userModel.findOne(
      { unVerifiedEmail: email, citizenshipId },
      {
        _id: 1,
      }
    );
  }
  async getParentByUnverifiedEmail(email: string, id: ObjectId) {
    return await this.userModel.findOne(
      { unVerifiedEmail: email, _id: id },
      {
        _id: 1,
      }
    );
  }
  async verifiedEmail(email: string, id: ObjectId) {
    const result = await this.userModel.updateOne(
      { _id: id },
      {
        $unset: { unVerifiedEmail: "" },
        $set: { email },
      }
    );
    if (result.nModified === 1) return true;
    return false;
  }
  async isExistUnverifiedEmail(email: string) {
    const parent = await this.userModel.findOne(
      { unVerifiedEmail: email },
      {
        _id: 1,
      }
    );
    if (parent) return true;
    return false;
  }
  async isParentExistById(id: ObjectId) {
    const parent = await this.userModel.findOne({ _id: id }, { _id: 1 });
    if (parent) return true;
    return false;
  }
  async getParentsOfStudent(institutionId: ObjectId, studentId: ObjectId) {
    return await this.userModel.find({
      parentStudents: { $elemMatch: { studentId } },
    });
  }
  async addStudent(
    data: Omit<CreateType<ParentStudent>, "parentType">,
    parentId: ObjectId
  ) {
    const parent = await this.userModel.findOneAndUpdate(
      {
        _id: parentId,
        "parentStudents.studentId": { $ne: data.studentId },
      },
      { $addToSet: { parentStudents: data } },
      { new: true }
    );
    return parent;
  }
  async pullStudent(studentId: ObjectId, parentId: ObjectId) {
    const result = await this.userModel.updateOne(
      { _id: parentId },
      {
        $pull: { parentStudents: { studentId } },
      }
    );
    if (result.nModified === 1) return true;
    return false;
  }
}
