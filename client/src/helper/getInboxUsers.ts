import { InboxsQuery } from "../generated/graphql";
import getUserToken from "./getUserToken";

export default function (inboxUsers: InboxsQuery["inboxs"][0]["users"]) {
  const user = getUserToken();
  if (user)
    return inboxUsers
      .filter((u) => u._id !== user._id)
      .map((u) => u.fullName || "hatalı kullanıcı")
      .join(",");
  return "hata";
}
