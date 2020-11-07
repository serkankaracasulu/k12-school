import { Service, Inject } from "typedi";
import { InstitutionService } from "./institution";
import { ApolloError } from "apollo-server";
import { School } from "../models/schoolSchema";
import { InstitutionModel } from "./../models/Institution";
import { StudentService } from "./student";
import { AddressLocation } from "./../models/address";
import { ObjectId } from "mongodb";
import dataloadersfc from "../dataLoaders";
import { IDataLoader } from "./../types";

@Service()
export class SchoolService {
  private readonly institutionModel = InstitutionModel;
  private readonly dataloaders: IDataLoader;
  constructor(
    @Inject(() => StudentService)
    private readonly studentService: StudentService,
    @Inject(() => InstitutionService)
    private readonly institutionService: InstitutionService
  ) {
    this.dataloaders = dataloadersfc();
  }

  async getById(instId: ObjectId, schoolId: ObjectId) {
    const inst = await this.institutionService.getById(instId);
    if (inst) {
      const school = inst.schools.id(schoolId);
      return school;
    }
  }
  async getManyByInstId(instId: ObjectId) {
    const inst = await this.institutionService.getById(instId);
    if (!inst) throw new ApolloError("Inst didn't find");
    return inst.schools.toObject();
  }
  async getByEOkulCode(instId: ObjectId, code: string) {
    const institution = await this.institutionService.getById(instId);
    if (institution) {
      const school = institution.schools.find(
        (schoolValue) => schoolValue.eOkulCode === code
      );
      if (school) return school;
    }
  }
  async create(
    data: Omit<School, "_id" | "createdAt" | "educationYears" | "classes">,
    instId: ObjectId
  ) {
    const newSchoolId = new ObjectId();
    const inst = await this.institutionModel.findOneAndUpdate(
      {
        _id: instId,
      },
      {
        $push: {
          schools: {
            $each: [{ ...data, _id: newSchoolId }],
            $position: 0,
          },
        },
      },
      { select: { schools: { $elemMatch: { _id: newSchoolId } } }, new: true }
    );
    if (inst) {
      const school = inst.schools.id(newSchoolId);
      this.dataloaders.institutionLoaderById.clear(instId);
      return school;
    }
  }
  async update(id: ObjectId, data: Partial<School>, instId: ObjectId) {
    const options = {
      new: true,
      arrayFilters: [{ "school._id": id }],
      select: { schools: { $elemMatch: { _id: id } } },
    };
    const schoolSetPath = "schools.$[school]";
    const schoolDoc: any = { [`${schoolSetPath}.name`]: data.name };
    if (data.eOkulCode)
      schoolDoc[`${schoolSetPath}.eOkulCode`] = data.eOkulCode;
    if (data.schoolKindId)
      schoolDoc[`${schoolSetPath}.schoolKindId`] = data.schoolKindId;
    const inst = await this.institutionModel.findOneAndUpdate(
      {
        _id: instId,
        "schools._id": id,
      },
      { $set: schoolDoc, options },
      { arrayFilters: [{ "school._id": id }], new: true }
    );
    if (inst) {
      this.dataloaders.institutionLoaderById.clear(instId);
      const school = inst.schools.id(id);
      return school;
    }
  }
  async remove(instId: ObjectId, id: ObjectId) {
    const result = await this.institutionModel.updateOne(
      { _id: instId, "schools._id": id },
      {
        $pull: { schools: { _id: id } },
      }
    );
    if (result.n !== 1 || result.ok !== 1) return false;
    this.dataloaders.institutionLoaderById.clear(instId);
    await this.studentService.dismissSchoolBySchoolId(instId, id);
    return true;
  }
  async getByClassId(instId: ObjectId, classId: ObjectId) {
    const institution = await this.institutionModel.findOne(
      { _id: instId },
      { schools: { $elemMatch: { "classes._id": classId } } }
    );
    if (!institution) throw new Error("Institution didn't find");
    const [school] = institution.schools;
    if (school) return school;
  }
  async addAddress(
    address: AddressLocation,
    instId: ObjectId,
    schoolId: ObjectId
  ) {
    const inst = await this.institutionModel.findOneAndUpdate(
      { _id: instId },
      { $set: { "schools.$[school].address": address } },
      {
        arrayFilters: [{ "school._id": schoolId }],
        select: { schools: { $elemMatch: { _id: schoolId } } },
        new: true,
      }
    );
    if (!inst) throw new Error("Does not exist inst");
    const school = inst.schools.id(schoolId);
    if (!school) throw new Error("Does not exist school");
    this.dataloaders.institutionLoaderById.clear(instId);
    return school.address;
  }
}
