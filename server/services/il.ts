import { Service } from "typedi";
import { IlModel, Il } from "./../models/ilIlce";

@Service()
export class IlService {
  private readonly ilModel = IlModel;
  async getByText(text: string) {
    const [q1, q2] = text.split(" ");
    const pipeline = [
      {
        $unwind: {
          path: "$ilceleri",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          [q2 ? "$and" : "$or"]: [
            {
              ilceleri: {
                $regex: new RegExp(q2 ? `^${q2}` : `^${q1}`, "i"),
              },
            },
            {
              il: {
                $regex: new RegExp(`^${q1}`, "i"),
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          il: { $first: "$il" },
          ilceleri: { $push: "$ilceleri" },
        },
      },
      { $limit: 5 },
    ];
    return await this.ilModel.aggregate<Il>(pipeline);
  }
}
