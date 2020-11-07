import { Service, Inject } from "typedi";
import { PersonService } from "./person";
import { StudentModel, Student } from "../models/student";
import { QueryType } from "../types";
import { SchoolService } from "./school";
import { ApolloError } from "apollo-server";
import { ClassService } from "./classType";
import { StudentBuilPath } from "./../helper/StudentBuildPath";
import { existsSync, unlinkSync } from "fs";
import { Address } from "../models/address";
import { ObjectId } from "mongodb";
import { UpdateQuery } from "mongoose";
import { IStudent } from "./../models/student";

@Service()
export class StudentService extends PersonService {
  private readonly studentModel = StudentModel;
  @Inject(() => SchoolService)
  private readonly schoolService: SchoolService;
  @Inject(() => ClassService)
  private readonly classService: ClassService;
  constructor() {
    super();
    this.studentModel = StudentModel;
  }
  async getByQuery(
    query: QueryType<Student> & {
      notClass?: boolean | undefined;
      studentIds?: ObjectId[] | undefined;
      schoolId?: ObjectId;
      classId?: ObjectId;
      search?: string;
      page?: number;
    }
  ) {
    const {
      classId,
      schoolId,
      notClass,
      studentIds,
      institutionId,
      search,
      page,
    } = query;
    const cond: { [K in keyof Partial<Student>]: any } & { $text?: any } = {
      institutionId,
    };
    cond.school = notClass && !classId ? { $ne: schoolId } : schoolId || null;
    cond.class = notClass ? { $ne: classId } : classId || null;
    if (studentIds) cond._id = { $in: studentIds };
    if (search) cond.$text = { $search: search, $language: "turkish" };
    if (page)
      return this.studentModel
        .find(cond)
        .limit(12)
        .skip((page - 1) * 12);
    const students = this.dataLoader.studentLoader.load({ ...cond });
    if (students) return students;
  }
  async getManyForDriver(
    search: string,
    allowedId: ObjectId[],
    studentIds?: ObjectId[]
  ) {
    if (
      studentIds &&
      !studentIds.every((e) =>
        allowedId.some((a) => a.toHexString() === e.toHexString())
      )
    ) {
      throw new Error("Forbidden");
    }
    const students = studentIds
      ? await this.dataLoader.studentLoader.load({
          _id: { $in: studentIds },
        })
      : await this.dataLoader.studentLoader.load({
          $text: { $search: search, $language: "turkish" },
          _id: { $in: allowedId },
        });
    if (students !== undefined) return students;
  }

  async getStudentById(id: ObjectId) {
    return await this.dataLoader.studentLoaderById.load(id);
  }
  async getCount(query: { schoolId?: ObjectId; classId?: ObjectId }) {
    const { schoolId, classId } = query;
    return await this.studentModel.countDocuments({
      school: schoolId,
      class: classId,
    });
  }
  async getStudentManyById(ids: ObjectId[]) {
    return await this.dataLoader.studentLoaderById.loadMany(ids);
  }
  async isExistStudentById(instId: ObjectId, studentId: ObjectId) {
    const cond: Partial<Student> = {
      _id: studentId,
      institutionId: instId,
    };
    const student = await this.studentModel.findOne(cond, { _id: 1 });
    if (student) return true;
    return false;
  }
  async getCountBySchoolId(schoolId: ObjectId) {
    const cond: Partial<Student> = { school: schoolId };
    return await this.studentModel.countDocuments(cond);
  }
  async getCountByClassId(classId: ObjectId) {
    const cond: Partial<Student> = { class: classId };
    return await this.studentModel.countDocuments(cond);
  }
  async getStudentByCitizenshipId(citizenshipId: string, instId: ObjectId) {
    const studentT = await this.dataLoader.studentLoader.load({
      citizenshipId,
      institutionId: instId,
    });
    if (studentT) {
      const [student] = studentT;
      return student;
    }
  }
  async updateStudent(data: UpdateQuery<IStudent>, id: ObjectId) {
    return await this.studentModel.findOneAndUpdate(
      { _id: id },
      {
        $set: data,
      }
    );
  }
  async createStudent(
    data: Omit<
      Student,
      "password" | "username" | "notifications" | "createdAt" | "kind" | "roles"
    >
  ) {
    const username = await this.generateUserName(
      data.firstName,
      data.lastName,
      data.citizenshipId
    );
    const newStudent = new Student(
      data.institutionId,
      data.firstName,
      data.lastName,
      data.citizenshipId,
      data.school,
      data.class
    );
    newStudent._id = data._id;
    if (data.schoolNo) newStudent.schoolNo = data.schoolNo;
    if (username) newStudent.username = username || data._id.toHexString();
    if (data.foreignLanguage) newStudent.foreignLanguage = data.foreignLanguage;
    if (data.profilePhoto) data.profilePhoto = newStudent.profilePhoto;
    return new this.studentModel(newStudent).save();
  }
  async generateUserName(
    firstName: string,
    lastName: string,
    citizenshipId: string
  ) {
    var trMap = {
      çÇ: "c",
      ğĞ: "g",
      şŞ: "s",
      üÜ: "u",
      ıİ: "i",
      öÖ: "o",
    };
    let fullname = firstName + lastName;
    for (var key in trMap) {
      fullname = fullname.replace(
        new RegExp("[" + key + "]", "g"),
        trMap[key as keyof typeof trMap]
      );
    }
    fullname = fullname
      .replace(/[^-a-zA-Z0-9\s]+/gi, "") // remove non-alphanumeric chars
      .replace(/\s/gi, "")
      .toLowerCase();
    let unique = false;
    let tryCount = 0;
    let username = fullname;
    while (!unique && tryCount <= citizenshipId.length) {
      tryCount += 1;
      const student = await this.studentModel.findOne({ username }, { _id: 1 });
      if (student) {
        username = fullname + citizenshipId.substring(0, tryCount);
      } else unique = true;
    }
    if (unique) return username;
  }
  async transferSchoolMany(
    instId: ObjectId,
    studentIds: ObjectId[],
    schoolId: ObjectId
  ) {
    const school = await this.schoolService.getById(instId, schoolId);
    if (!school) throw new ApolloError("School didn't find");
    const result = await this.studentModel.updateMany(
      { _id: { $in: studentIds } },
      { $set: { school: schoolId }, $unset: { class: "" } }
    );
    this.dataLoader.studentLoader.clear({ _id: { $in: studentIds } });
    if (result.nModified > 0 && result.ok === 1) return true;
    return false;
  }
  async transferClassMany(
    instId: ObjectId,
    studentIds: ObjectId[],
    schoolId: ObjectId,
    classId: ObjectId
  ) {
    const cl = await this.classService.getById(instId, schoolId, classId);
    if (!cl) throw new ApolloError("Class didn't find");
    const result = await this.studentModel.updateMany(
      { _id: { $in: studentIds }, institutionId: instId },
      { $set: { school: schoolId, class: classId } }
    );
    this.dataLoader.studentLoader.clear({
      _id: { $in: studentIds },
      institutionId: instId,
    });
    if (result.nModified > 0 && result.ok === 1) return true;
    return false;
  }
  async dismissSchool(instId: ObjectId, studentId: ObjectId) {
    const result = await this.studentModel.updateOne(
      { _id: studentId, institutionId: instId },
      {
        $unset: {
          school: "",
          class: "",
        },
      }
    );
    this.dataLoader.studentLoader.clear({
      _id: studentId,
      institutionId: instId,
    });
    if (result.ok === 1 && result.n === 1) return true;
    return false;
  }
  async dismissSchoolBySchoolId(instId: ObjectId, schoolId: ObjectId) {
    const result = await this.studentModel.updateMany(
      {
        institutionId: instId,
        school: schoolId,
      },
      {
        $unset: {
          school: "",
          class: "",
        },
      }
    );
    this.dataLoader.studentLoader.clear({
      institutionId: instId,
      school: schoolId,
    });
    if (result.ok === 1) return true;
    return false;
  }
  async dismissClassBySchoolId(instId: ObjectId, classId: ObjectId) {
    const result = await this.studentModel.updateMany(
      {
        institutionId: instId,
        school: classId,
      },
      {
        $unset: {
          school: "",
          class: "",
        },
      }
    );
    this.dataLoader.studentLoader.clear({
      institutionId: instId,
      school: classId,
    });
    if (result.ok === 1) return true;
    return false;
  }
  async dismissClass(instId: ObjectId, studentId: ObjectId) {
    const result = await this.studentModel.updateOne(
      { _id: studentId, institutionId: instId },
      {
        $unset: {
          class: "",
        },
      }
    );
    this.dataLoader.studentLoader.clear({
      _id: studentId,
      institutionId: instId,
    });
    if (result.ok === 1 && result.n === 1) return true;
    return false;
  }
  async studentDelete(instId: ObjectId, studentId: ObjectId) {
    const cond: Partial<Student> = { _id: studentId, institutionId: instId };
    const result = await this.studentModel.deleteOne(cond);
    if (result.n === 0) throw new ApolloError("Student didn't find");
    if (!result.deletedCount) return false;
    const studentBuildPath = new StudentBuilPath(instId.toHexString());
    const imagePath = studentBuildPath.getProfilePath(studentId.toHexString());
    if (existsSync(studentBuildPath.getProfilePath(studentId.toHexString()))) {
      unlinkSync(imagePath);
    }
    this.dataLoader.studentLoader.clear(cond);
    return true;
  }
  async updateAddress(addressData: Address, studentId: ObjectId) {
    const student = await this.studentModel.findOneAndUpdate(
      { _id: studentId },
      { $set: { address: addressData } },
      { new: true }
    );
    if (!student) throw new Error("Student didn't find");
    this.dataLoader.studentLoader.clear({ _id: studentId });
    return student.address;
  }
}
