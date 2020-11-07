import { MessageFragment, PersonKind } from "../generated/graphql";
import getUserToken from "./getUserToken";

export default function getMessageOptimistic(
  inboxId: string,
  message: string
): MessageFragment {
  const user = getUserToken();
  if (user) {
    const [firstName, ...lastNameArray] = user.fullName.split(" ");
    const lastName = lastNameArray ? lastNameArray.join(" ") : "";
    const newMessage: MessageFragment = {
      __typename: "Message",
      _id: "newId",
      ownerId: user?._id,
      inboxId,
      sent: new Date().toISOString(),
      message,
      owner: {
        _id: user._id,
        fullName: user.fullName,
        firstName,
        lastName,
        __typename: "Person",
        kind: PersonKind.User,
      },
      idOfUnReaders: [],
    };
    return newMessage;
  } else throw new Error("You must login");
}
