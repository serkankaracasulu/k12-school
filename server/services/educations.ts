import { Service, Inject } from "typedi";
import { IUser, UserModel } from "./../models/user";
import { Model } from "mongoose";
import { Education } from "../models/education";
import { ObjectId } from "mongodb";

@Service()
export class EducationService {
  private readonly userModel: Model<IUser> = UserModel;
  async add(data: Partial<Education>, userId: ObjectId) {
    const newId = new ObjectId();
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: { educations: { ...data, _id: newId }, $position: 0 },
      },
      { select: { educations: { $elemMatch: { _id: newId } } }, new: true }
    );
    if (user) {
      const education = user.educations.id(newId);
      return education;
    }
  }
}
