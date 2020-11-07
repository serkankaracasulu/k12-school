import { Service } from "typedi";
import { InboxModel } from "./../models/personInbox";
import { ObjectId } from "mongodb";

@Service()
export class InboxUserService {
  create(userId: ObjectId) {
    return new InboxModel(userId);
  }
}
