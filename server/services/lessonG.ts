import { Service } from "typedi";
import { Lesson, LessonG } from "./../models/lessonGModel";
import dataLoader from "../dataLoaders";
import { CreateType } from "../types";
import { ObjectId } from "mongodb";

@Service()
export class LessonGService {
  private readonly lessonGModel = Lesson;
  private readonly dataLoader = dataLoader();
  async getById(id: ObjectId) {
    return await this.dataLoader.lessonGLoader.load(id);
  }
  async getAll() {
    return await this.lessonGModel.find({});
  }
  async create(data: CreateType<LessonG>) {
    const newLesson = new this.lessonGModel(data).save();
    return newLesson;
  }
  async update(data: Partial<LessonG>, id: ObjectId) {
    return await this.lessonGModel.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      { new: true }
    );
  }
  async remove(id: ObjectId) {
    const result = await this.lessonGModel.deleteOne({ _id: id });
    if (!result.n) throw new Error("LessonG didn't find");
    if (result.deletedCount === 1) return true;
    return false;
  }
  async createTeacherField(lessonId: ObjectId, ids: ObjectId[]) {
    return await this.lessonGModel.findByIdAndUpdate(
      lessonId,
      {
        $addToSet: {
          teacherFieldIds: {
            $each: ids,
          },
        },
      },
      { new: true }
    );
  }
}
