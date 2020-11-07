import { Service } from "typedi";
import { MessageModel, Message, Inbox } from "./../models/personInbox";
import { QueryType } from "../types";
import { ObjectId } from "mongodb";

@Service()
export class MessageService {
  private readonly messageModel = MessageModel;
  async getManyByInboxId(inboxId: ObjectId, skip: number) {
    const cond: QueryType<Message> = {
      inboxId,
    };
    return await this.messageModel
      .find(cond)
      .limit(15)
      .skip(skip)
      .sort({ sent: -1 });
  }
  async create(inbox: Inbox, ownerId: ObjectId) {
    const messageDoc = new Message(inbox, ownerId);
    return await new this.messageModel(messageDoc).save();
  }
  async getUnreadCountByUserId(userId: ObjectId) {
    return await this.messageModel.countDocuments({
      idOfUnReaders: { $in: [userId] },
    });
  }
  async getUnreadCountByInputId(userId: ObjectId, inboxId: ObjectId) {
    return await this.messageModel.countDocuments({
      idOfUnReaders: { $in: [userId] },
      inboxId,
    });
  }
  async updateRead(messageId: ObjectId, userId: ObjectId) {
    const update = await this.messageModel.updateOne(
      { _id: messageId },
      {
        $pull: { idOfUnReaders: userId },
      }
    );
    if (!update.n) throw new Error("Message didn't find");
    if (update.nModified) return true;
    return false;
  }
}
