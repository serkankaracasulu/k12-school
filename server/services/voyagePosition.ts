import { Service } from "typedi";
import { CreateType } from "../types";
import { ObjectId } from "mongodb";
import {
  PositionType,
  VoyagePosition,
  VoyagePositionModel,
} from "./../models/VoyagePosition";
@Service()
export default class VoyagePositionService {
  readonly #voyagePositionModel = VoyagePositionModel;
  async create(data: CreateType<VoyagePosition>) {
    const voyage = new this.#voyagePositionModel(data);
    try {
      return voyage.save();
    } catch (error) {}
  }
  async addPosition(
    driverId: ObjectId,
    sessionId: ObjectId,
    voyageId: ObjectId,
    voyageTimeId: ObjectId,
    position: PositionType
  ) {
    const voyage = await this.#voyagePositionModel.findOneAndUpdate(
      {
        sessionId,
        driverId,
        voyageId,
        voyageTimeId,
      },
      {
        $push: { positions: position },
      },
      { new: true }
    );
    const lastPosition = voyage?.positions[voyage?.positions.length - 1];
    return lastPosition;
  }
}
