import { Service } from "typedi";
import {
  StudyModel,
  Study,
  StudyStudentStatus,
  IStudy,
  StudyState,
} from "./../models/study";
import { DateTime } from "luxon";
import findStartEndOfWeek from "../helper/findWeekStartEnd";
import { QueryType } from "../types";
import { ObjectId } from "mongodb";

@Service()
export class StudyService {
  private readonly studyModel = StudyModel;
  async getManyByTeacherId(teacherId: ObjectId, week?: number) {
    const cond: QueryType<Study> = { teacherId };
    if (week !== undefined && !isNaN(week)) {
      const [start, end] = findStartEndOfWeek(week);
      cond.date = { $lte: end, $gte: start };
    } else cond.date = DateTime.utc().startOf("weeks").toJSDate();
    return await this.studyModel.find(cond);
  }
  async create(data: Omit<Study, "_id" | "students">) {
    return await new this.studyModel(data).save();
  }
  async remove(studyId: ObjectId, teacherId: ObjectId) {
    const result = await this.studyModel.deleteOne({ _id: studyId, teacherId });
    if (!result.n) throw new Error("Study didn't find");
    if (result.deletedCount) return true;
    return false;
  }
  async getManyByQuery(query: {
    lessonId?: ObjectId;
    date?: Date;
    endDate?: Date;
    classId: ObjectId;
  }) {
    const minDate = DateTime.local().plus({ hours: -5 }).toJSDate();
    const cond: QueryType<Study> = {
      permissionClasses: { $in: [query.classId] },
    };
    cond.public = true;
    if (query.lessonId) cond.lessonId = query.lessonId;
    cond.date = {};
    cond.date.$gte = query.date || minDate;
    if (query.endDate) cond.date.$lte = query.endDate;
    return await this.studyModel.find(cond);
  }
  async getManyByStudentId(studentId: ObjectId, week: number) {
    const [start, end] = findStartEndOfWeek(week || 0);
    const cond: QueryType<Study> = {
      students: {
        $elemMatch: { _id: studentId, status: StudyStudentStatus.Accept },
      },
      date: { $lte: end, $gte: start },
    };
    return await this.studyModel.find(cond);
  }
  async getById(id: ObjectId) {
    return (await this.studyModel.findById(id)) || undefined;
  }
  async join(study: IStudy, studentId: ObjectId, classId: ObjectId) {
    const cond: QueryType<Study> & { "students.studentId": any } = {
      public: true,
      permissionClasses: { $in: [classId] },
      _id: study._id,
      "students.studentId": { $nin: [studentId] },
    };
    if (study.capacity) cond.students = { $not: { $size: study.capacity } };
    return await this.studyModel.findOneAndUpdate(
      cond,
      { $addToSet: { students: { studentId } } },
      { new: true }
    );
  }
  async leave(studyId: ObjectId, studentId: ObjectId) {
    const cond: QueryType<Study> & { "students.studentId": any } = {
      _id: studyId,
      "students.studentId": { $in: [studentId] },
    };
    return await this.studyModel.findOneAndUpdate(
      cond,
      { $pull: { students: { studentId } } },
      { new: true }
    );
  }
  async getManyIntersectionForStudent(studentId: ObjectId, study: IStudy) {
    const endDate = DateTime.fromJSDate(study.date)
      .plus({ minutes: study.duration })
      .toJSDate();
    const piplene = studyIntersection(
      study._id,
      studentId,
      study.date,
      endDate
    );
    return await this.studyModel.aggregate<Study>(piplene);
  }
  async getManyIntersectionForTeacher(
    teacherId: ObjectId,
    date: Date,
    duration: number
  ) {
    const endDate = DateTime.fromJSDate(date)
      .plus({ minutes: duration })
      .toJSDate();
    const pipeline = studyTeacherIntersection(teacherId, date, endDate);
    return await this.studyModel.aggregate<Study>(pipeline);
  }
  async updateStatus(data: {
    studyId: ObjectId;
    studentId: ObjectId;
    teacherId: ObjectId;
    status: StudyStudentStatus;
  }) {
    const { studyId, teacherId, studentId } = data;
    const cond: QueryType<Study> & { "students.studentId": any } = {
      _id: studyId,
      teacherId,
      "students.studentId": { $in: [studentId] },
    };
    const study = await this.studyModel.findOneAndUpdate(
      cond,
      {
        "students.$[student].status": status,
      },
      { new: true, arrayFilters: [{ "student.studentId": studentId }] }
    );
    if (study) return study;
  }
  async updateState(
    teacherId: ObjectId,
    studyId: ObjectId,
    state: StudyState,
    studyStudentId: ObjectId
  ) {
    const cond: QueryType<Study> = {
      _id: studyId,
      teacherId: teacherId,
    };
    const study = await this.studyModel.findOneAndUpdate(
      cond,
      {
        "students.$[student].state": state,
      },
      {
        arrayFilters: [{ "student._id": studyStudentId }],
        new: true,
      }
    );
    if (study) return study;
  }
}
function studyIntersection(
  studyId: ObjectId,
  studentId: ObjectId,
  startDate: Date,
  endDate: Date
) {
  const today = DateTime.local().plus({ hours: -5 }).toJSDate();
  return [
    {
      $match: {
        "students.studentId": studentId,
        _id: {
          $ne: studyId,
        },
        date: {
          $gte: today,
        },
      },
    },
    {
      $project: {
        date: 1,
        endDate: {
          $add: [
            "$date",
            {
              $multiply: ["$duration", 60000],
            },
          ],
        },
      },
    },
    {
      $match: {
        $or: [
          {
            date: {
              $lte: endDate,
              $gte: startDate,
            },
          },
          {
            endDate: {
              $lte: endDate,
              $gte: startDate,
            },
          },
          {
            $and: [
              {
                date: { $lte: startDate },
              },
              {
                endDate: { $gte: endDate },
              },
            ],
          },
        ],
      },
    },
  ];
}

function studyTeacherIntersection(
  teacherId: ObjectId,
  startDate: Date,
  endDate: Date
) {
  const today = DateTime.local().plus({ hours: -5 }).toJSDate();
  return [
    {
      $match: {
        teacherId: new ObjectId(teacherId),
        date: {
          $gte: today,
        },
      },
    },
    {
      $project: {
        date: 1,
        endDate: {
          $add: [
            "$date",
            {
              $multiply: ["$duration", 60000],
            },
          ],
        },
      },
    },
    {
      $match: {
        $or: [
          {
            date: {
              $lte: endDate,
              $gte: startDate,
            },
          },
          {
            endDate: {
              $lte: endDate,
              $gte: startDate,
            },
          },
          {
            $and: [
              {
                date: { $lte: startDate },
              },
              {
                endDate: { $gte: endDate },
              },
            ],
          },
        ],
      },
    },
  ];
}
