import { Service } from "typedi";
import { InstitutionModel, Institution } from "./../models/Institution";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";
import dataloaders from "../dataLoaders";

@Service()
export class InstitutionService {
  private readonly institutionModel = InstitutionModel;
  async isExistByName(name: string) {
    const cond: Partial<Institution> = { name };
    const institution = await this.institutionModel.findOne(cond, { _id: 1 });
    if (institution) return true;
    return false;
  }
  async create(creator: ObjectId, name: string) {
    const instDoc: Partial<Institution> = { name, creator };
    return await new this.institutionModel(instDoc).save();
  }
  async getById(id: ObjectId) {
    const dataloader = dataloaders();
    return dataloader.institutionLoaderById.load(id);
  }
  async getManyByIds(ids: ObjectId[]) {
    return await this.institutionModel.find({ _id: { $in: ids } });
  }
}
