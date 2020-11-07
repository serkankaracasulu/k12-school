import { Schema, model, Document, Types } from "mongoose";
import { Field, ObjectType, ID, registerEnumType, Int } from "type-graphql";
import { Person } from "./person";
import { ObjectId } from "mongodb";

export enum UserType {
  Student = "Student",
  User = "User",
  Parent = "Parent",
}
registerEnumType(UserType, {
  name: "UserType",
});

@ObjectType()
export class Inbox {
  constructor(message: string, to: ObjectId[], creator: ObjectId) {
    this.lastMessage = message;
    this.userIds = [creator, ...to];
  }
  @Field(() => ID)
  _id: ObjectId = new ObjectId();

  @Field(() => String)
  lastMessage: Message["message"];

  @Field(() => [ID])
  userIds: ObjectId[];

  @Field(() => Int, { nullable: true })
  readonly unReadCount?: number;

  @Field(() => [Person])
  readonly users: Person[];

  @Field()
  createdAt: Date = new Date(Date.now());

  @Field()
  updatedAt: Date = new Date(Date.now());
}
@ObjectType()
export class Message {
  constructor(inbox: Inbox, ownerId: ObjectId) {
    this.inboxId = inbox._id;
    this.message = inbox.lastMessage;
    this.ownerId = ownerId;
    this.idOfUnReaders = inbox.userIds.filter(
      (e) => e.toHexString() !== ownerId.toHexString()
    );
  }
  @Field(() => ID)
  _id: ObjectId = new ObjectId();

  @Field(() => ID)
  inboxId: Inbox["_id"];

  @Field(() => ID)
  ownerId: Person["_id"];

  @Field(() => Person, { nullable: true })
  readonly owner?: Person;

  @Field()
  message: string;

  @Field()
  sent: Date = new Date(Date.now());

  @Field(() => [ID])
  idOfUnReaders: ObjectId[] = [];
}
export interface IMessage extends Document, Message {
  _id: ObjectId;
}

export interface IInbox extends Document, Inbox {
  _id: ObjectId;
}

const inboxSchema = new Schema<IInbox>(
  {
    userIds: { type: [Schema.Types.ObjectId], index: true },
    lastMessage: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 600,
    },
    updatedAt: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true }
);

export const InboxModel = model<IInbox>("Inbox", inboxSchema);

const messageSchema = new Schema<IMessage>({
  inboxId: { type: Schema.Types.ObjectId, required: true, ref: "Inbox" },
  sent: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  idOfUnReaders: [Schema.Types.ObjectId],
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 600,
  },
});
export const MessageModel = model<IMessage>("Message", messageSchema);
