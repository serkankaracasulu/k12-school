import { Model } from "mongoose";
export default async function(model: Model<any, {}>, pipeline: any) {
  const cursor = model
    .aggregate(pipeline)
    .cursor({
      batchSize: 1
    })
    .exec();
  const returnData = await cursor.next();
  if (returnData) return returnData.data;
}
