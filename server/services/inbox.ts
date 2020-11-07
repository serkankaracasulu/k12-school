import { Service, Inject } from "typedi";
import { InboxModel, Inbox } from "./../models/personInbox";
import { ObjectId } from "mongodb";

@Service()
export class InboxService {
  private readonly inboxModel = InboxModel;
  async getManyByPersonId(personId: ObjectId, skip: number) {
    return await this.inboxModel
      .find({ userIds: { $in: [personId] } })
      .limit(10)
      .skip(skip)
      .sort({ updatedAt: -1 });
  }
  async getById(id: ObjectId) {
    const inbox = await this.inboxModel.findById(id);
    return inbox || undefined;
  }
  async getByTo(to: ObjectId[]) {
    const inbox = await this.inboxModel.findOne({
      userIds: { $size: to.length, $all: to },
    });
    return inbox || undefined;
  }
  async updateLMessageByTo(to: ObjectId[], message: string, creator: ObjectId) {
    return (
      (await this.inboxModel.findOneAndUpdate(
        {
          userIds: { $size: to.length + 1, $all: [...to, creator] },
        },
        { $set: { lastMessage: message } },
        { new: true }
      )) || undefined
    );
  }
  async create(message: string, to: ObjectId[], creator: ObjectId) {
    const inboxDoc = new Inbox(message, to, creator);
    return await new this.inboxModel(inboxDoc).save();
  }
}
