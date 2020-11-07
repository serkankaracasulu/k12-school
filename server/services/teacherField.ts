import { Service } from "typedi";
import { TeacherFieldModel, TeacherField } from "./../models/teacherField";
import { CreateType } from "../types";
import { ObjectId } from "mongodb";

@Service()
export class TeacherFieldService {
  private readonly teacherFieldModel = TeacherFieldModel;

  async create(name: string) {
    const doc: CreateType<TeacherField> = { name };
    return await new this.teacherFieldModel(doc).save();
  }
  async remove(id: ObjectId) {
    const result = await this.teacherFieldModel.deleteOne({ _id: id });
    if (!result.n) throw new Error("Teacher field didn't find");
    if (result.deletedCount === 1) return true;
    return false;
  }
  async getAll() {
    return await this.teacherFieldModel.find({});
  }
  async getManyByIds(ids: ObjectId[]) {
    return await this.teacherFieldModel.find({ _id: { $in: ids } });
  }
  async removeDepartment(id: ObjectId, departmentId: ObjectId) {
    return await this.teacherFieldModel.findByIdAndUpdate(
      id,
      {
        $pullAll: { departmentIds: [departmentId] },
      },
      { new: true }
    );
  }
  async removeAllDepartments(departmentId: ObjectId) {
    await this.teacherFieldModel.updateMany(
      {},
      {
        $pullAll: {
          departmentIds: [departmentId],
        },
      },
      { multi: true }
    );
  }
  async addDepartments(id: ObjectId, departmentIds: ObjectId[]) {
    return await this.teacherFieldModel.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          departmentIds: {
            $each: departmentIds,
          },
        },
      },
      { new: true }
    );
  }
}
