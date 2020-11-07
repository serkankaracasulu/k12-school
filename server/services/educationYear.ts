import { Service, Inject } from "typedi";
import { ApolloError } from "apollo-server";
import { SchoolService } from "./school";
import { EducationYear } from "./../models/educationYear";
import { InstitutionModel } from "./../models/Institution";
import { ObjectId } from "mongodb";
import { CreateType } from "../types";
import dataloadersfc from "../dataLoaders";
import { IDataLoader } from "../types";

@Service()
export class EducationYearService {
  private readonly institutionModel = InstitutionModel;
  private readonly dataloaders: IDataLoader;
  constructor(
    @Inject(() => SchoolService) private readonly schoolService: SchoolService
  ) {
    this.dataloaders = dataloadersfc();
  }
  async getLastEducationYear(instId: ObjectId, schoolId: ObjectId) {
    const school = await this.schoolService.getById(instId, schoolId);
    if (!school) throw new ApolloError("School didn't find");
    if (school.educationYears.length > 0) return school.educationYears[0];
  }
  async getById(instId: ObjectId, schoolId: ObjectId, id: ObjectId) {
    const school = await this.schoolService.getById(instId, schoolId);
    if (!school) throw new Error("School didn't find");
    const educationYear = school.educationYears.id(id);
    if (educationYear) return educationYear;
  }
  async create(
    data: CreateType<EducationYear>,
    instId: ObjectId,
    schoolId: ObjectId
  ) {
    const _id = new ObjectId();
    const inst = await this.institutionModel.findOneAndUpdate(
      {
        _id: instId,
      },
      {
        $push: {
          "schools.$[school].educationYears": {
            $each: [{ ...data, _id }],
            $position: 0,
          },
        },
      },
      {
        new: true,
        select: { schools: { $elemMatch: { _id: schoolId } } },
        arrayFilters: [{ "school._id": schoolId }],
      }
    );
    if (!inst) throw new Error("Inst didn't find");
    const school = inst.schools.id(schoolId);
    if (!school) throw new Error("School didn't find");
    const educationYear = school.educationYears.id(_id);
    if (educationYear) {
      this.dataloaders.institutionLoaderById.clear(instId);
      return educationYear;
    }
  }
  async remove(isntId: ObjectId, schoolId: ObjectId, id: ObjectId) {
    const result = await this.institutionModel.updateOne(
      {
        _id: isntId,
        "schools._id": schoolId,
      },
      {
        $pull: {
          "schools.$[school].educationYears": { _id: id },
          "schools.$[school].classes.$[].lessons": { educationYearId: id },
        },
      },
      { arrayFilters: [{ "school._id": schoolId }] }
    );
    if (!result.n) throw new Error("Inst didn't find");

    if (result.nModified) {
      this.dataloaders.institutionLoaderById.clear(isntId);
      return true;
    }
    return false;
  }
}
