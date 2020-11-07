import { Service, Inject } from "typedi";
import { ClassLessonModel, Lesson } from "./../models/lessonSchema";
import { LessonBaseService } from "./lessonBase";
import dataLoaders from "../dataLoaders";
import { IActiveUser } from "../types";
import { Hour } from "../models/hourSchema";
import { SchoolService } from "./school";
import { InstitutionService } from "./institution";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";

@Service()
export class LessonService extends LessonBaseService {
  constructor(
    @Inject(() => SchoolService) private readonly schoolService: SchoolService,
    @Inject(() => InstitutionService)
    private readonly institutionService: InstitutionService
  ) {
    super();
  }
  private readonly lessonModel = ClassLessonModel;

  async getByTeacherIdAll(userId: ObjectId) {
    const cond: Partial<Lesson> = { teacherId: userId };
    const lessons = await this.lessonModel.find(cond);
    return lessons;
  }
  async getManyByEducationYearId(
    instId: ObjectId,
    schoolId: ObjectId,
    classId: ObjectId,
    educationYearId: ObjectId
  ) {
    const cond: Partial<Lesson> = {
      institutionId: instId,
      schoolId,
      classId,
      educationYearId,
    };
    return await this.lessonModel.find(cond);
  }
  async getById(user: IActiveUser, lessonId: ObjectId) {
    const dataLoader = dataLoaders(user);
    return await dataLoader.lessonLoader.load(lessonId);
  }
  async create(
    data: Omit<Lesson, "createdAt" | "lessonWeeklySchedules" | "_id">
  ) {
    return await new this.lessonModel(data).save();
  }
  async update(
    data: Omit<Partial<Lesson>, "lessonWeeklySchedules">,
    instId: ObjectId,
    id: ObjectId
  ) {
    const cond: Partial<Lesson> = {
      institutionId: instId,
      _id: id,
    };
    return await this.lessonModel.findOneAndUpdate(cond, data, {
      new: true,
    });
  }
  async getCountByClassId(classId: ObjectId) {
    return await this.lessonModel.countDocuments({ classId });
  }
  async remove(instId: ObjectId, id: ObjectId) {
    const cond: Partial<Lesson> = {
      institutionId: instId,
      _id: id,
    };
    const result = await this.lessonModel.remove(cond);
    const dataloader = dataLoaders();
    if (result.deletedCount === 1 && result.ok == 1) {
      dataloader.lessonLoader.clear(id);
      return true;
    }
    return false;
  }
  /**
   *Returns all the lessons of the active education year of the teacher
   *at the given time and day
   *@param hour contain start and finish hour by Date time
   */
  async getManyIntersectionOfTeacherByDayAndHour(
    instId: ObjectId,
    hour: Hour,
    teacherId: ObjectId,
    day: number
  ) {
    const mainQuery: { $or: any[] } & Partial<Lesson> = {
      $or: [],
      teacherId: teacherId,
      institutionId: instId,
    };
    const inst = await this.institutionService.getById(instId);
    if (!inst) throw new Error("Inst didn't find");
    for (const school of inst.schools) {
      const selectedEducationYear =
        school.educationYears.length > 0 && school.educationYears[0];
      if (
        !school.weeklyHour ||
        !selectedEducationYear ||
        !selectedEducationYear.isUpToDate()
      )
        throw new Error("Education year or weeklyhour didn't setup");
      const selectedHours = school.weeklyHour.instersectionHours(hour);
      const hourQuery =
        selectedHours.length === 1
          ? { "lessonWeeklySchedules.hourCode": selectedHours[0].code }
          : selectedHours.map((s) => {
              return { "lessonWeeklySchedules.hourCode": s.code };
            });
      const query = {
        $and: [
          { educationYearId: selectedEducationYear._id },
          { "lessonWeeklySchedules.day": day },
          Array.isArray(hourQuery) && hourQuery.length > 0
            ? { $or: hourQuery }
            : hourQuery,
        ],
      };
      mainQuery.$or.push(query);
    }
    return await this.lessonModel.find(mainQuery);
  }

  async pullWeeklySchedule(
    instId: ObjectId,
    scheduleId: ObjectId,
    lessonId: ObjectId
  ) {
    return await this.lessonModel.findOneAndUpdate(
      { _id: lessonId, institutionId: instId },
      { $pull: { lessonWeeklySchedules: { _id: scheduleId } } },
      { new: true }
    );
  }
  async getManyGtDay(
    teacherId: ObjectId,
    classId: ObjectId,
    educationYearId: ObjectId,
    day: number,
    notMine: boolean
  ) {
    const pipeLine = getPipeline(
      teacherId,
      classId,
      educationYearId,
      day,
      "$gte",
      notMine
    );
    return this.lessonModel.aggregate<Lesson>(pipeLine);
  }
  async getManyLtDay(
    teacherId: ObjectId,
    classId: ObjectId,
    educationYearId: ObjectId,
    day: number,
    notMine: boolean
  ) {
    const pipeLine = getPipeline(
      teacherId,
      classId,
      educationYearId,
      day,
      "$lte",
      notMine
    );
    return this.lessonModel.aggregate<Lesson>(pipeLine);
  }
  /**
   *Teacher's lessons for a specific education year in a class
   */
  async getManyTeacherForEducationYearInClass(
    teacherId: ObjectId,
    educationYearId: ObjectId,
    classId: ObjectId
  ) {
    return await this.lessonModel.find({
      teacherId: teacherId,
      classId: classId,
      educationYearId: educationYearId,
    });
  }
  /**
   *Except Teacher's lessons for a specific education year in a class
   */
  async getManyExcludingTeacherForEducationYearInClass(
    teacherId: ObjectId,
    educationYearId: ObjectId,
    classId: ObjectId
  ) {
    return await this.lessonModel.find({
      teacherId: { $ne: teacherId },
      classId: classId,
      educationYearId: educationYearId,
    });
  }
}
type AmmounType = "$lte" | "$gte";
function getPipeline(
  teacherId: ObjectId,
  classId: ObjectId,
  educationYearId: ObjectId,
  amount: number,
  type: AmmounType,
  ne: boolean
) {
  const field: { [K in keyof Omit<Lesson, "lessonWeeklySchedules">]: any } = {
    schoolId: 1,
    classId: 1,
    lessonId: 1,
    weeklyHour: 1,
    teacherId: 1,
    institutionId: 1,
    educationYearId: 1,
    createdAt: 1,
    _id: 1,
  };
  return [
    {
      $match: {
        teacherId: {
          $not: { [ne ? "$eq" : "$ne"]: new Types.ObjectId(teacherId) },
        },
        classId: classId,
        educationYearId: educationYearId,
      },
    },
    {
      $project: {
        lessonWeeklySchedules: {
          $filter: {
            input: "$lessonWeeklySchedules",
            as: "lw",
            cond: {
              [type]: ["$$lw.day", amount],
            },
          },
        },
        ...field,
      },
    },
  ];
}
