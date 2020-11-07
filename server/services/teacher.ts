import { Service, Inject } from "typedi";
import { ApolloError } from "apollo-server";
import { UserService } from "./user";
import { ObjectId } from "mongodb";
import { UserModel } from "../models/user";

@Service()
export class TeacherService {
  constructor(
    @Inject(() => UserService)
    private readonly userService: UserService
  ) {}
  private readonly userModel = UserModel;
  async getTeachersById(instId: ObjectId) {
    return await this.userModel.find({ "teacher.institutionId": instId });
  }
  async create(instId: ObjectId, userId: ObjectId, addedById: ObjectId) {
    const user = await this.userService.isExistById(userId);
    if (!user) throw new ApolloError("User didn't find.");
    const result = await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          teacher: {
            _id: new ObjectId(),
            institutionId: instId,
            allSchool: true,
            owner: false,
            schoolIds: [],
            addedById,
          },
        },
      },
      { new: true }
    );
    return result;
  }
  async remove(instId: ObjectId, teacherId: ObjectId) {
    const teacher = await this.userModel.updateOne(
      {
        "teacher._id": teacherId,
        "teacher.institutionId": instId,
      },
      { $unset: { teacher: "" } }
    );
    if (teacher.ok && teacher.nModified) return true;
    return false;
  }
}
