import { Types } from "mongoose";
const { ObjectId } = Types;
export default function(
  fields: { name: string; value: any }[],
  docId: string | Types.ObjectId
) {
  let pipeline: any = [
    {
      $match: {
        _id: new ObjectId(docId)
      }
    }
  ];
  let pathName = "";
  fields.forEach(field => {
    pathName += pathName ? `.${field.name}` : `${field.name}`;
    pipeline.push(
      {
        $unwind: {
          path: `$${pathName}`,
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          [`${pathName}._id`]: new ObjectId(field.value)
        }
      }
    );
  });
  pipeline.push({
    $replaceRoot: {
      newRoot: {
        data: `$${pathName}`
      }
    }
  });
  return pipeline;
}
