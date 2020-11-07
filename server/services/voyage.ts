import { Service } from "typedi";
import { ObjectId } from "mongodb";
import {
  VoyageModel,
  Voyage,
  StudentVoyegeInfo,
  StudentVoyegeEnum,
} from "../models/voyage";
import { CreateType } from "../types";
import { VoyageTime } from "./../models/voyage";

@Service()
export class VoyageService {
  private readonly voyageModel = VoyageModel;

  async create(data: CreateType<Voyage>, times: CreateType<VoyageTime>[]) {
    try {
      const orderTimes = times.sort((a, b) => {
        if (a.day < b.day) return -1;
        else if (a.day === b.day) {
          if (a.hour.valueOf() < b.hour.valueOf()) return -1;
          else return 0;
        }

        return 0;
      });
      return await new this.voyageModel({
        ...data,
        voyageTimes: orderTimes,
      }).save();
    } catch (error) {
      throw error;
    }
  }
  async getManyByInstId(driverId: ObjectId) {
    return await this.voyageModel.find({ driverId });
  }
  async getManyByStudentId(studentId: ObjectId) {
    return await this.voyageModel.find({ studentIds: { $in: [studentId] } });
  }
  async addStudent(
    studentId: ObjectId,
    voyageId: ObjectId,
    driverId: ObjectId
  ) {
    const voyageInfo: CreateType<StudentVoyegeInfo> = {
      studentId,
      status: StudentVoyegeEnum.gotOff,
      order: 0,
    };
    const result = await this.voyageModel.updateOne(
      { _id: voyageId, driverId },
      {
        $addToSet: {
          studentIds: studentId,
          "voyageTimes.$[vt].studentInfos": voyageInfo,
        },
      },
      { arrayFilters: [{ "vt.studentInfos.studentId": { $nin: [studentId] } }] }
    );
    if (!result.n) throw new Error("Voyage didn't find");
    if (result.nModified) return true;
    return false;
  }
  async removeStudent(
    studentId: ObjectId,
    voyageId: ObjectId,
    driverId: ObjectId
  ) {
    const result = await this.voyageModel.updateOne(
      { _id: voyageId, driverId },
      {
        $pull: {
          studentIds: studentId,
          "voyageTimes.$[].studentInfos": { studentId },
        },
      }
    );
    if (!result.n) throw new Error("Voyage didn't find");
    if (result.nModified) return true;
    return false;
  }
  async removeVoyageTime(voyageId: ObjectId, timeId: ObjectId) {
    const result = await this.voyageModel.updateOne(
      { _id: voyageId },
      { $pull: { voyageTimes: { _id: timeId } } }
    );
    if (!result.n) throw new Error("Voyage didn't find");
    if (result.nModified) return true;
    return false;
  }
  async addVoyageTime(voyageId: ObjectId, data: CreateType<VoyageTime>) {
    const timeId = data._id || new ObjectId();
    const voyage = await this.voyageModel.findOneAndUpdate(
      { _id: voyageId },
      {
        $push: {
          voyageTimes: {
            $each: [{ ...data, _id: timeId }],
            $sort: { day: 1, hour: 1 },
          },
        },
      },
      { new: true }
    );
    if (!voyage) throw new Error("Voyage didn't find");
    const time = voyage.voyageTimes.id(timeId);
    if (time) return time;
  }
  async getById(voyageId: ObjectId) {
    const voyage = await this.voyageModel.findById(voyageId);
    return voyage || null;
  }
  async getVoyageTime(voyageId: ObjectId, voyageTimeId: ObjectId) {
    const voyage = await this.getById(voyageId);
    if (!voyage) throw new Error("Voyage didn't find");
    return voyage.voyageTimes.id(voyageTimeId) || null;
  }
  async setStudentLast(voyageId: ObjectId, studentId: ObjectId) {
    const voyage = await this.voyageModel.findById(voyageId);
    if (!voyage) throw new Error("Voyage didn't find");
    const maxOrder = voyage.studentIds.length - 1;
    const result = await this.voyageModel.updateOne(
      { _id: voyageId },
      {
        $set: {
          "voyageTimes.$[].studentInfos.$[student].order": maxOrder,
        },
        $inc: {
          "voyageTimes.$[].studentInfos.$[studentm].order": -1,
        },
      },
      {
        arrayFilters: [
          {
            "student.studentId": studentId,
          },
          {
            "studentm.order": maxOrder,
            "studentm.studentId": { $ne: studentId },
          },
        ],
      }
    );
    if (result.nModified && result.ok) return true;
    return false;
  }
  async updateVoyageStart(
    voyageId: ObjectId,
    timeId: ObjectId,
    sessionId: ObjectId
  ) {
    const voyage = await this.voyageModel.findOneAndUpdate(
      {
        _id: voyageId,
        voyageTimes: { $elemMatch: { _id: timeId, isStart: false } },
      },
      {
        $set: {
          "voyageTimes.$[closeOne].isStart": true,
          "voyageTimes.$[openOne].isStart": false,
          "voyageTimes.$[closeOne].sessionId": sessionId,
        },
      },
      {
        arrayFilters: [
          { "closeOne._id": timeId },
          {
            "openOne._id": { $ne: timeId },
            "openOne.isStart": true,
          },
        ],
        new: true,
      }
    );
    if (voyage) return voyage.voyageTimes.id(timeId);
  }
  async updateVoyageStop(voyageId: ObjectId, timeId: ObjectId) {
    const voyage = await this.voyageModel.findOneAndUpdate(
      {
        _id: voyageId,
        voyageTimes: { $elemMatch: { _id: timeId, isStart: true } },
      },
      {
        $set: {
          "voyageTimes.$[openOne].isStart": false,
        },
      },
      {
        arrayFilters: [
          {
            "openOne._id": timeId,
            "openOne.isStart": true,
          },
        ],
        new: true,
      }
    );
    if (voyage) return voyage.voyageTimes.id(timeId);
  }
  async getActiveVoyageTime(institutionId: ObjectId, studentId: ObjectId) {
    const voyage = await this.voyageModel.findOne({
      institutionId,
      voyageTimes: {
        $elemMatch: { isStart: true, "studentInfos.studentId": studentId },
      },
    });
    return voyage;
  }
}
