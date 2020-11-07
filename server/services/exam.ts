import { Service, Inject } from "typedi";
import { Exam, ExamModel, Grade } from "../models/exam";
import { GradeService } from "./grade";
import { ObjectId } from "mongodb";
import { CreateType } from "../types";
import { UpdateQuery } from "mongoose";
import { IExam } from "./../models/exam";

@Service()
export class ExamService {
  private readonly examModel = ExamModel;
  constructor(
    @Inject(() => GradeService) private readonly gradeService: GradeService
  ) {}
  async create(data: Omit<CreateType<Exam>, "termName">) {
    return await new this.examModel(data).save();
  }
  async update(instId: ObjectId, examId: ObjectId, data: UpdateQuery<IExam>) {
    return await this.examModel.findOneAndUpdate(
      { _id: examId, lessonId: data.lessonId, institutionId: instId },
      {
        $set: data,
      }
    );
  }
  async delete(instId: ObjectId, id: ObjectId) {
    const result = await this.examModel.deleteOne({
      institutionId: instId,
      _id: id,
    });
    if (!result.n) throw new Error("Exam didn't find");
    if (result.deletedCount) return true;
    return false;
  }
  async getManyForTeacher(
    instId: ObjectId,
    lessonId: ObjectId,
    educationYearId: ObjectId
  ) {
    const cond: Partial<Exam> = {
      lessonId,
      institutionId: instId,
      educationYearId,
    };
    return await this.examModel.find(cond).sort({ date: 1 });
  }
  async getManyForStudent(
    instId: ObjectId,
    lessonId: ObjectId,
    studentId: ObjectId
  ) {
    const cond: Partial<Exam> = { lessonId, institutionId: instId };
    const proj: { [T in keyof Partial<Exam>]: number } = {
      date: 1,
      termId: 1,
      lessonId: 1,
      educationYearId: 1,
      lessonHourCode: 1,
    };
    return await this.examModel.find(cond, {
      grades: {
        $elemMatch: { studentId },
      },
      proj,
    });
  }
  async addGrade(
    examId: ObjectId,
    lessonId: ObjectId,
    studentId: ObjectId,
    grade: number
  ) {
    const newGrade = this.gradeService.create(studentId, grade);
    const result = await this.examModel.updateOne(
      {
        _id: examId,
        lessonId,
        "grades.studentId": { $ne: studentId },
      },
      { $push: { grades: newGrade } }
    );
    if (!result.n) throw new Error("Exam didn't find");
    if (result.nModified === 1) return newGrade;
  }
  async updateGrade(
    examId: ObjectId,
    lessonId: ObjectId,
    studentId: ObjectId,
    grade: number
  ) {
    const exam = await this.examModel.findOneAndUpdate(
      { _id: examId, lessonId },
      { $set: { "grades.$[grade].grade": grade } },
      { arrayFilters: [{ "grade.studentId": studentId }], new: true }
    );
    if (!exam) throw new Error("Exam didn't find");
    return exam.grades.find(
      (g) => g.studentId.toHexString() === studentId.toString()
    );
  }
}
