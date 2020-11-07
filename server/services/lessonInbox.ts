import { Service } from "typedi";
import { LessonInboxModel, LessonInbox } from "./../models/lessonInbox";
import { ObjectId } from "mongodb";

@Service()
export class LessonInboxService {
  private readonly lessonInboxModel = LessonInboxModel;
  async getManyByLessonId(lessonId: ObjectId, instId: ObjectId, skip: number) {
    return await this.lessonInboxModel
      .find({
        lessonId: lessonId,
        institutionId: instId,
      })
      .limit(10)
      .skip(skip)
      .sort({ sent: -1 });
  }
  async create(data: Omit<LessonInbox, "_id" | "sent">) {
    return new this.lessonInboxModel(data).save();
  }
}
