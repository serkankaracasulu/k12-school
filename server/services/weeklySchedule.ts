import { Service, Inject } from "typedi";
import { LessonService } from "./lesson";
import { WeeklySchedule, ClassLessonModel } from "../models/lessonSchema";
import { CreateType } from "../types";
import { ObjectId } from "mongodb";

@Service()
export class WeeklyScheduleService {
  private lessonModel = ClassLessonModel;
  constructor(
    @Inject(() => LessonService) private readonly lessonService: LessonService
  ) {}
  async create(
    instId: ObjectId,
    data: CreateType<WeeklySchedule>,
    lessonId: ObjectId
  ) {
    return await this.lessonModel.findOneAndUpdate(
      { _id: lessonId, institutionId: instId },
      { $push: { lessonWeeklySchedules: data } },
      { new: true }
    );
  }
}
