import {
  Resolver,
  Ctx,
  Arg,
  Int,
  Query,
  Authorized,
  Mutation,
  InputType,
  Field,
  FieldResolver,
  ResolverInterface,
  Root,
  Subscription,
  ResolverFilterData,
  PubSub,
  Publisher,
} from "type-graphql";
import { Context, AuthenticationError, ApolloError } from "apollo-server-core";
import { CContext, Topic } from "../types";
import { Length, ArrayUnique } from "class-validator";
import { Person, Role } from "./../models/person";
import { Inbox, Message, IMessage, IInbox } from "../models/personInbox";
import { Result, ObjectIdScalar } from "./types";
import { UserInputError } from "apollo-server";
import { PersonService } from "./../services/person";
import { Container } from "typedi";
import { InboxService } from "./../services/inbox";
import { MessageService } from "./../services/message";
import { ObjectId } from "mongodb";

@InputType()
class MessageInput implements Partial<Message> {
  @ArrayUnique()
  @Field(() => [ObjectIdScalar])
  to: ObjectId[];

  @Length(1, 600)
  @Field(() => String)
  message: string;
}

@Resolver(() => Message)
export class MessageFieldResolver implements ResolverInterface<Message> {
  constructor(private readonly personService: PersonService) {
    this.personService = Container.get(PersonService);
  }
  @FieldResolver(() => Person)
  async owner(
    @Root() message: IMessage | Message,
    @Ctx() ctx: Context<CContext>
  ): Promise<Person> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const user = await this.personService.getById(message.ownerId);
    return user || this.personService.errorPerson;
  }
}

@Resolver(() => Inbox)
export class InboxFieldResolver implements ResolverInterface<Inbox> {
  constructor(
    private readonly personService: PersonService,
    private readonly messageService: MessageService
  ) {
    this.personService = Container.get(PersonService);
    this.messageService = Container.get(MessageService);
  }
  @FieldResolver(() => [Person])
  async users(
    @Root() inbox: IInbox | Inbox,
    @Ctx() ctx: Context<CContext>
  ): Promise<Person[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return await this.personService.getManyById(inbox.userIds);
  }
  @FieldResolver(() => Int)
  async unReadCount(
    @Root() inbox: IInbox | Inbox,
    @Ctx() ctx: Context<CContext>
  ) {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return await this.messageService.getUnreadCountByInputId(
      new ObjectId(activeUser._id),
      inbox._id
    );
  }
}
interface MessagePayload {
  message: IMessage;
  inbox: IInbox;
}
@Resolver()
export class InboxResolver {
  constructor(
    private readonly inboxService: InboxService,
    private readonly messageService: MessageService
  ) {
    this.inboxService = Container.get(InboxService);
    this.messageService = Container.get(MessageService);
  }
  @Authorized(Role.USER)
  @Query(() => [Inbox])
  async inboxs(
    @Ctx() ctx: Context<CContext>,
    @Arg("skip", () => Int) skip: number
  ): Promise<Inbox[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return await this.inboxService.getManyByPersonId(
      new ObjectId(activeUser._id),
      skip
    );
  }
  @Authorized(Role.USER)
  @Query(() => Inbox)
  async inbox(
    @Ctx() ctx: Context<CContext>,
    @Arg("inboxId", () => ObjectIdScalar, { nullable: true })
    inboxId?: ObjectId,
    @Arg("to", () => [ObjectIdScalar], { nullable: true }) to?: ObjectId[]
  ): Promise<Inbox> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    if (!inboxId && !to) throw new ApolloError("");
    if (inboxId) {
      const inbox = await this.inboxService.getById(inboxId);
      if (inbox) return inbox;
    } else if (to) {
      const inbox = await this.inboxService.getByTo([
        new ObjectId(activeUser._id),
        ...to,
      ]);
      if (inbox) return inbox;
    }
    throw new ApolloError("Inbox didn't find");
  }
  @Authorized(Role.USER)
  @Query(() => [Message])
  async messages(
    @Ctx() ctx: Context<CContext>,
    @Arg("skip", () => Int) skip: number,
    @Arg("inboxId", () => ObjectIdScalar) inboxId: ObjectId
  ): Promise<Message[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return this.messageService.getManyByInboxId(inboxId, skip);
  }
  @Authorized(Role.USER)
  @Mutation(() => Message)
  async sendMessage(
    @Ctx() ctx: Context<CContext>,
    @Arg("message", () => MessageInput) message: MessageInput,
    @PubSub(Topic.messageUpdated)
    publish: Publisher<MessagePayload>
  ): Promise<Message> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const users = message.to.filter((t) => t.toHexString() !== activeUser._id);
    if (users.length === 0) throw new UserInputError("");
    try {
      let inbox = await this.inboxService.updateLMessageByTo(
        users,
        message.message,
        new ObjectId(activeUser._id)
      );
      if (!inbox)
        inbox = await this.inboxService.create(
          message.message,
          users,
          new ObjectId(activeUser._id)
        );
      const newMesage = await this.messageService.create(
        inbox,
        new ObjectId(activeUser._id)
      );
      await publish({ message: newMesage, inbox });
      return newMesage;
    } catch (error) {
      throw error;
    }
  }
  @Authorized(Role.USER)
  @Mutation(() => Result)
  async messageRead(
    @Ctx() ctx: Context<CContext>,
    @Arg("messageId", () => ObjectIdScalar) messageId: ObjectId
  ): Promise<Result> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const result = await this.messageService.updateRead(
      messageId,
      new ObjectId(activeUser._id)
    );
    return { success: result };
  }
  @Authorized(Role.USER)
  @Query(() => Int)
  async unReadMessageCount(@Ctx() ctx: Context<CContext>): Promise<number> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return await this.messageService.getUnreadCountByUserId(
      new ObjectId(activeUser._id)
    );
  }
  @Authorized(Role.USER)
  @Subscription({
    topics: Topic.messageUpdated,
    filter: ({
      payload,
      context,
    }: ResolverFilterData<MessagePayload, void, CContext>) => {
      if (!context.activeUser) return false;

      return (
        payload.message.ownerId.toHexString() !== context.activeUser._id &&
        payload.inbox.userIds.some(
          (u) => u.toHexString() === context.activeUser?._id
        )
      );
    },
  })
  inboxNotification(@Root() applicationPayload: MessagePayload): Message {
    return applicationPayload.message;
  }
}
