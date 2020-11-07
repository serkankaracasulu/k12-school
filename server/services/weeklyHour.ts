import { Service, Inject } from "typedi";
import { SchoolService } from "./school";
import { ApolloError } from "apollo-server";
import { WeeklyHour } from "../models/hourSchema";
import { InstitutionModel } from "./../models/Institution";
import { ObjectId } from "mongodb";
import dataloadersfc from "../dataLoaders";
import { IDataLoader } from "../types";

@Service()
export class WeeklyHourService {
  private readonly institutionModel = InstitutionModel;
  private readonly dataloaders: IDataLoader;
  constructor(
    @Inject(() => SchoolService) private readonly schoolService: SchoolService
  ) {
    this.dataloaders = dataloadersfc();
  }
  async getById(instId: ObjectId, schoolId: ObjectId) {
    const school = await this.schoolService.getById(instId, schoolId);
    if (!school) throw new ApolloError("School didn't find.");
    if (!school.weeklyHour) return;
    return school.weeklyHour;
  }
  async create(
    instId: ObjectId,
    schoolId: ObjectId,
    data: Omit<WeeklyHour, "_id">
  ) {
    const result = await this.institutionModel.updateOne(
      { _id: instId, "schools._id": schoolId },
      {
        $set: {
          "schools.$[school].weeklyHour": data,
        },
      },
      {
        arrayFilters: [{ "school._id": schoolId }],
      }
    );
    if (!result.n) throw new Error("Inst didn't find");
    this.dataloaders.institutionLoaderById.clear(instId);
    return await this.getById(instId, schoolId);
  }
}
