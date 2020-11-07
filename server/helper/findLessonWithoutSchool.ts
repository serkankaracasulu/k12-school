import { ClassLessonModel } from "./../models/lessonSchema";
import { IActiveUser } from "../types";
import { ObjectId } from "mongodb";

export default async function (ids: readonly ObjectId[], user?: IActiveUser) {
  const lessons = await ClassLessonModel.find({
    _id: { $in: [...ids] },
    institutionId: user?.teacher?.institutionId || user?.student?.institutionId,
  });
  return ids.map((i) => lessons.find((l) => l.id === i.toHexString()));
}
