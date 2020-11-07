import { Service } from "typedi";
import { IlModel, Il } from "./../models/ilIlce";

@Service()
export class IlceService {
  private readonly ilModel = IlModel;
  async getByPlaka(plaka: number) {
    const doc = await this.ilModel.findOne({ plaka: plaka });
    return doc?.ilceleri;
  }
}
