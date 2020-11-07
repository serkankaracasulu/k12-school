import { Service } from "typedi";
import { ObjectId } from "mongodb";
import {
  StudentNotificationModel,
  Notification,
  StudentNotificationState,
  StudentNotificationAction,
} from "../models/studentNotification";

@Service()
export class NotificationService {
  private readonly studentNotificationModel = StudentNotificationModel;
  constructor() {}

  async getByUserId(id: ObjectId, skip: number) {
    const cond: Partial<Notification> = {
      personId: id,
    };
    return await this.studentNotificationModel
      .find(cond)
      .limit(5)
      .skip(skip)
      .sort({ createdAt: 1 });
  }
  async update(ids: ObjectId[], state: StudentNotificationState) {
    const doc: Partial<Notification> = {
      state,
    };
    const result = await this.studentNotificationModel.updateMany(
      { _id: { $in: ids } },
      doc
    );
    if (result.nModified > 0) return true;
    return false;
  }
  async create(
    data: Omit<Notification, "_id" | "state" | "action">,
    action?: StudentNotificationAction
  ) {
    const notificationDoc = new Notification(
      data.personId,
      data.notificationType,
      data.lessonId
    );
    if (action) notificationDoc.action = action;
    if (data.createdAt) notificationDoc.createdAt = data.createdAt;
    if (data.targetId) notificationDoc.targetId = data.targetId;
    return await new this.studentNotificationModel(notificationDoc).save();
  }
  async createMany(
    data: Omit<Notification, "_id" | "state" | "action" | "personId">,
    personIds: ObjectId[]
  ) {
    const notificationDocs: Notification[] = [];
    for (const id of personIds) {
      const notificationDoc = new Notification(
        id,
        data.notificationType,
        data.lessonId
      );
      if (data.createdAt) notificationDoc.createdAt = data.createdAt;
      if (data.targetId) notificationDoc.targetId = data.targetId;
      notificationDocs.push(notificationDoc);
    }
    return await this.studentNotificationModel.insertMany(notificationDocs, {
      ordered: false,
    });
  }
}
