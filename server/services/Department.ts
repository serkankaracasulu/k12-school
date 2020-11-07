import { Service } from "typedi";
import { DepartmentModel } from "../models/department";
import { Department } from "./../models/department";
import { ObjectId } from "mongodb";

@Service()
export class DepartmentService {
  private readonly departmentModel = DepartmentModel;
  async getById(id: ObjectId) {
    return await this.departmentModel.findById(id);
  }
  async getAllByIds(ids: ObjectId[]) {
    return await this.departmentModel.find({ _id: { $in: ids } });
  }
  async create(data: Omit<Department, "_id">) {
    return await new this.departmentModel(data).save();
  }
  async remove(id: ObjectId) {
    const result = await this.departmentModel.deleteOne({ _id: id });
    if (!result.n) throw new Error("Department didn't find");
    if (result.deletedCount) return true;
    return false;
  }
  async getAll() {
    return await this.departmentModel.find({});
  }
}
