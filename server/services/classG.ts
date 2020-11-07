import { Service, Inject } from "typedi";
import { School, ClassLesson } from "./../models/schoolGModel";
import { ObjectId } from "mongodb";

@Service()
export class ClassGService {
  private readonly schoolGModel = School;
  async removeLessonsById(id: ObjectId) {
    await this.schoolGModel.updateMany(
      {},
      {
        $pull: {
          "classes.$[].lessons": {
            lessonId: id,
          },
        },
      },
      { multi: true }
    );
  }
  async getById(schoolId: ObjectId, classId: ObjectId) {
    const school = await this.schoolGModel.findById(schoolId, {
      classes: { $elemMatch: { _id: classId } },
    });
    if (!school) throw new Error("School didn't find");
    return school.classes.id(classId);
  }
  async removeLessonById(
    schoolId: ObjectId,
    classId: ObjectId,
    lessonId: ObjectId
  ) {
    const school = await this.schoolGModel.findOneAndUpdate(
      { _id: schoolId, "classes._id": classId },
      { $pull: { "classes.$.lessons": { _id: lessonId } } },
      { new: true }
    );
    if (!school) throw new Error("School didn't find");
    const cl = school.classes.id(classId);
    if (!cl) throw new Error("Class didn't find");
    return cl;
  }
  async getByLevel(schoolId: ObjectId, level: number) {
    const school = await this.schoolGModel.findOne(
      { _id: schoolId },
      { classes: { $elemMatch: { level } } }
    );
    if (!school) throw new Error("School didn't find");
    const [cl] = school.classes;
    if (!cl) throw new Error("Class didn't fidn");
    return cl;
  }
  async createLesson(
    schoolId: ObjectId,
    classId: ObjectId,
    lesson: Omit<ClassLesson, "_id">
  ) {
    const newId = new ObjectId();
    const school = await this.schoolGModel.findByIdAndUpdate(
      {
        _id: schoolId,
        "classes._id": classId,
      },
      {
        $push: {
          "classes.$[cl].lessons": {
            _id: newId,
            ...lesson,
          },
        },
      },
      {
        select: { classes: { $elemMatch: { _id: classId } } },
        new: true,
        arrayFilters: [{ "cl._id": classId }],
      }
    );
    if (!school) throw new Error("School didn't find");
    const cl = school.classes.id(classId);
    if (!cl) throw new Error("Class didn't find");
    return cl;
  }
}
