import { Service, Inject } from "typedi";
import { AbsenceModel, Absence } from "./../models/absence";
import { QueryType } from "../types";
import { getDayStartEnd } from "./../helper/getDayStartEnd";
import findWeekStartEnd from "../helper/findWeekStartEnd";
import { EducationYearService } from "./educationYear";
import { IHour } from "./../models/hourSchema";
import { ILesson } from "../models/lessonSchema";
import { ObjectId } from "mongodb";

@Service()
export class AbsenceService {
  constructor(
    private readonly absenceModel = AbsenceModel,
    @Inject(() => EducationYearService)
    private readonly educationYearService: EducationYearService
  ) {}
  async getForTeacher(teacherId: ObjectId) {
    const [start, finish] = getDayStartEnd();
    const cond: QueryType<Absence> = {
      date: { $gte: start, $lte: finish },
      teacherId,
    };
    return await this.absenceModel.find(cond).sort({ date: -1 });
  }
  async getForStudentInThisWeek(studentId: ObjectId) {
    const [start, finish] = findWeekStartEnd(0);
    const cond: QueryType<Absence> = {
      date: { $gte: start, $lte: finish },
      studentId,
    };
    return await this.absenceModel.find(cond).sort({ date: -1 });
  }
  async getForStudentInThisTerm(
    studentId: ObjectId,
    instId: ObjectId,
    schoolId: ObjectId
  ) {
    const educationYear = await this.educationYearService.getLastEducationYear(
      instId,
      schoolId
    );
    if (!educationYear) throw new Error("Education year didn't find");
    const term = educationYear.getUpToDateTerm();
    if (!term) throw new Error("Term didn't find");
    const cond: QueryType<Absence> = {
      date: { $gte: term.start, $lte: term.finish },
      studentId,
    };
    return await this.absenceModel.find(cond).sort({ date: -1 });
  }
  async remove(id: ObjectId, teacherId: ObjectId) {
    const cond: Partial<Absence> = {
      _id: id,
      teacherId,
    };
    const result = await this.absenceModel.deleteOne(cond);
    if (result.deletedCount === 1) return true;
    return false;
  }
  async create(hour: IHour, lesson: ILesson, studentId: ObjectId) {
    const { start, code } = hour;
    if (!lesson.teacherId) throw new Error("lesson teacher does not exist");
    const newAbsenceDoc = new Absence(
      lesson._id,
      code,
      start,
      lesson.teacherId,
      studentId
    );
    return await new this.absenceModel(newAbsenceDoc).save();
  }
}
