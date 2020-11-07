import { Service, Inject } from "typedi";
import { UserModel, User } from "../models/user";
import { PersonService } from "./person";
import { EducationService } from "./educations";
import { Education } from "../models/education";
import { ObjectId } from "mongodb";
import { IActiveUser } from "../types";
import { IUser } from "./../models/user";
import { PersonKind, Role } from "../models/person";

@Service()
export class UserService extends PersonService {
  constructor(
    @Inject(() => EducationService)
    private readonly educationService: EducationService
  ) {
    super();
  }
  private readonly userModel = UserModel;
  async getByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
  async update(data: Partial<IUser>, userId: ObjectId) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: data },
      { new: true }
    );
  }
  async getById(id: ObjectId) {
    return await this.dataLoader.userLoader.load(id);
  }
  async updateSchool(userId: ObjectId, instId: ObjectId) {
    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          "teacher.owner": true,
          "teacher.institutionId": instId,
        },
      }
    );
  }
  async getManyByEmail(emails: string[]) {
    return await this.userModel.find({ email: { $in: emails } });
  }
  async create(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    const userDoc = new User(firstName, lastName, email, password);
    try {
      return await new this.userModel(userDoc).save();
    } catch (error) {}
  }
  async addEducation(data: Partial<Education>, userId: ObjectId) {
    return this.educationService.add(data, userId);
  }
  async removeJob(instId: ObjectId, userId: ObjectId) {
    const result = await this.userModel.updateOne(
      {
        _id: userId,
        institutionId: instId,
      },
      { $unset: { teacher: "" } }
    );
    if (result.n === 1 && result.ok === 1) return true;
    return false;
  }
  async getManyByTextSearchUser(search: string, activeUser: IActiveUser) {
    return await this.userModel
      .find(
        {
          $text: { $search: search, $language: "turkish" },
          $or: [
            activeUser.driver
              ? {
                  $or: [
                    {
                      "teacher.institutionId": {
                        $in: activeUser.driver.map((d) => d.institutionId),
                      },
                    },
                    {
                      institutionId: {
                        $in: activeUser.driver.map((d) => d.institutionId),
                      },
                      _id: {
                        $in: activeUser.driver.flatMap((d) =>
                          d.studentIds.map((s) => new ObjectId(s))
                        ),
                      },
                    },
                  ],
                }
              : activeUser.teacher
              ? {
                  $or: [
                    {
                      "teacher.institutionId": activeUser.teacher.institutionId,
                    },
                    {
                      "driver.institutions.institutionId":
                        activeUser.teacher.institutionId,
                    },
                    {
                      institutionId: activeUser.teacher.institutionId,
                    },
                  ],
                }
              : activeUser.student
              ? {
                  $or: [
                    {
                      institutionId: activeUser.student.institutionId,
                    },
                    {
                      "teacher.institutionId": activeUser.student.institutionId,
                    },
                  ],
                }
              : { null: false },
          ],
        },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);
  }
}
