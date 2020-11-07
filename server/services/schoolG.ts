import { Service } from "typedi";
import { School, SchoolG } from "./../models/schoolGModel";
import { ObjectId } from "mongodb";

@Service()
export class SchoolGServie {
  private readonly schoolGModel = School;
  async getById(id: ObjectId) {
    return await this.schoolGModel.findById(id);
  }
  async create(data: Omit<SchoolG, "_id">) {
    const sortedClass = data.classes.sort((a, b) => a.level - b.level);
    return await new this.schoolGModel({
      ...data,
      classes: sortedClass,
    }).save();
  }
  async getAll() {
    return await this.schoolGModel.find();
  }
}
