import { Service, Inject } from "typedi";
import { SchoolService } from "./school";
import { ClassType } from "./../models/classSchema";
import { InstitutionModel } from "./../models/Institution";
import { ObjectId } from "mongodb";
import dataloadersfc from "../dataLoaders";
import { IDataLoader } from "../types";

@Service()
export class ClassService {
  private readonly institutionModel = InstitutionModel;
  private readonly dataloaders: IDataLoader;
  constructor(
    @Inject(() => SchoolService)
    private readonly schoolService: SchoolService
  ) {
    this.dataloaders = dataloadersfc();
  }
  async getById(instId: ObjectId, schoolId: ObjectId, classId: ObjectId) {
    const school = await this.schoolService.getById(instId, schoolId);
    return school?.classes.id(classId);
  }
  async getManyById(instId: ObjectId, schoolId: ObjectId) {
    const school = await this.schoolService.getById(instId, schoolId);
    if (!school) throw new Error("School didn't find");
    return school.classes.toObject();
  }
  async create(
    data: Omit<ClassType, "createdAt" | "_id">,
    instId: ObjectId,
    schoolId: ObjectId
  ) {
    const newId = new ObjectId();
    const inst = await this.institutionModel.findOneAndUpdate(
      { _id: instId },
      {
        $push: {
          "schools.$[school].classes": {
            $each: [{ ...data, _id: newId }],
            $position: 0,
          },
        },
      },
      {
        select: {
          schools: { $elemMatch: { _id: schoolId } },
        },
        arrayFilters: [{ "school._id": schoolId }],
        new: true,
      }
    );
    if (!inst) throw new Error("Inst didn't find");
    const school = inst.schools.id(schoolId);
    if (!school) throw new Error("Inst didn't find");
    const newClass = school.classes.id(newId);
    if (!newClass) throw new Error("Inst didn't find");
    this.dataloaders.institutionLoaderById.clear(instId);
    return newClass;
  }
  async update(
    data: Omit<ClassType, "createdAt" | "_id">,
    instId: ObjectId,
    schoolId: ObjectId,
    classId: ObjectId
  ) {
    const inst = await this.institutionModel.findOneAndUpdate(
      { _id: instId },
      { $set: { "schools.$[school].classes.$[cl]": data } },
      {
        select: {
          schools: { $elemMatch: { _id: schoolId, classes: { classId } } },
        },
        arrayFilters: [{ "school._id": schoolId }, { "cl._id": classId }],
      }
    );
    if (!inst) throw new Error("Inst didn't find");
    const school = inst.schools.id(schoolId);
    if (!school) throw new Error("Inst didn't find");
    const editClass = school.classes.id(classId);
    if (!editClass) throw new Error("Inst didn't find");
    this.dataloaders.institutionLoaderById.clear(instId);
    return editClass;
  }
  async updateTeacher(
    instId: ObjectId,
    schoolId: ObjectId,
    classId: ObjectId,
    userId: ObjectId
  ) {
    const result = await this.institutionModel.updateOne(
      {
        _id: instId,
        "schools._id": schoolId,
        "schools.classes._id": classId,
        "schools.classes.classroomTeacher": { $ne: userId },
      },
      {
        $set: { "schools.$.classes.$[class].classroomTeacher": userId },
      },
      {
        arrayFilters: [{ "class._id": classId }],
      }
    );
    if (result.n === 1 && result.ok === 1 && result.nModified === 1) {
      this.dataloaders.institutionLoaderById.clear(instId);
      return true;
    }
    return false;
  }
  async remove(instId: ObjectId, schoolId: ObjectId, classId: ObjectId) {
    const result = await this.institutionModel.updateOne(
      { _id: instId, "schools._id": schoolId },
      {
        $pull: { "schools.$.classes": { _id: classId } },
      }
    );
    if (result.n === 1 && result.ok === 1 && result.nModified === 1) {
      this.dataloaders.institutionLoaderById.clear(instId);
      return true;
    }
    return false;
  }
  async updateRemoveTeacher(
    instId: ObjectId,
    schoolId: ObjectId,
    classId: ObjectId
  ) {
    const result = await this.institutionModel.updateOne(
      {
        _id: instId,
        "schools._id": schoolId,
        "schools.classes._id": classId,
      },
      {
        $unset: { "schools.$.classes.$[class].classroomTeacher": "" },
      },
      {
        arrayFilters: [{ "class._id": classId }],
      }
    );
    if (result.n === 1 && result.ok === 1 && result.nModified === 1) {
      this.dataloaders.institutionLoaderById.clear(instId);
      return true;
    }
    return false;
  }

  async getManyByData(
    data: Partial<ClassType>,
    instId: ObjectId,
    schoolId: ObjectId
  ) {
    const school = await this.schoolService.getById(instId, schoolId);
    if (!school) throw new Error("Inst didn't find");
    return school.classes.filter(
      (c) =>
        c.level === data.level &&
        c.code1 === data.code1 &&
        c.code === data.code &&
        c.name === data.name
    );
  }
}
