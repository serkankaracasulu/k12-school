import { Service } from "typedi";
import path from "path";
import { UniversityModel, University } from "../models/university";
import { ObjectId } from "mongodb";
import { CreateType } from "../types";

@Service()
export class UnivercityService {
  private readonly univercityModel = UniversityModel;
  async getById(id: ObjectId) {
    const university = this.univercityModel.findById(id);
    if (university) return university;
    else null;
  }
  async create(data: CreateType<University>) {
    return await new this.univercityModel(data).save();
  }

  public get logoAbsolutePath(): string {
    return path.resolve("public", "images", "universitiesLogo");
  }

  generateLogoPath(fileName: string) {
    return path.join(this.logoAbsolutePath, fileName);
  }

  async getAll() {
    return await this.univercityModel.find({});
  }
  async update(data: Omit<University, "_id">, id: ObjectId) {
    const univercity = await this.univercityModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (univercity) return univercity;
  }
}
