import * as React from "react";
import { useHistory } from "react-router-dom";

import { Badge, IconButton } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import MessageIcon from "@material-ui/icons/Mail";

import {
  InboxFragment,
  InboxsDocument,
  InboxsQuery,
  InboxsQueryVariables,
  MessagesDocument,
  MessagesQuery,
  MessagesQueryVariables,
  useInboxNotificationSubscription,
  useUnReadMessageCountQuery,
} from "../generated/graphql";
import getUserToken from "../helper/getUserToken";

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: 0,
      top: 13,
      padding: "0 4px",
      marginRight: theme.spacing(1),
      backgroundColor: theme.palette.primary.dark,
    },
  })
)(Badge);

export default function MessageBadge() {
  const history = useHistory();
  const user = getUserToken();
  useUnReadMessageCountQuery({
    onCompleted: (tData) => {
      setCount(tData.unReadMessageCount);
    },
  });
  const [count, setCount] = React.useState(0);
  useInboxNotificationSubscription({
    onSubscriptionData: (tData) => {
      if (!tData.subscriptionData.data) return;
      const { inboxNotification: newMessage } = tData.subscriptionData.data;
      const variables = { skip: 0, inboxId: newMessage.inboxId };
      try {
        const InboxQuery = tData.client.readQuery<
          InboxsQuery,
          InboxsQueryVariables
        >({
          query: InboxsDocument,
          variables: { skip: 0 },
        });
        if (InboxQuery && user) {
          const inboxs: InboxFragment[] = InboxQuery.inboxs.map(
            (inboxValue) => {
              if (inboxValue._id === newMessage.inboxId) {
                const users = inboxValue.users;
                return {
                  ...inboxValue,
                  lastMessage: newMessage.message,
                  updatedAt: newMessage.sent,
                  users,
                };
              } else return inboxValue;
            }
          );
          tData.client.writeQuery<InboxsQuery, InboxsQueryVariables>({
            query: InboxsDocument,
            variables: { skip: 0 },
            data: { inboxs },
          });
        }
      } catch (error) {
        //
      }
      setCount(count + 1);
      try {
        const messageQuery = tData.client.readQuery<
          MessagesQuery,
          MessagesQueryVariables
        >({
          query: MessagesDocument,
          variables,
        });
        if (messageQuery) {
          const { messages } = messageQuery;

          tData.client.writeQuery<MessagesQuery, MessagesQueryVariables>({
            query: MessagesDocument,
            variables,
            data: { messages: [newMessage, ...messages] },
          });
        }
      } catch (error) {
        //
      }
    },
  });
  return (
    <StyledBadge badgeContent={count}>
      <IconButton
        color="inherit"
        aria-label="messages"
        onClick={() => history.push("/messaging")}
      >
        <MessageIcon />
      </IconButton>
    </StyledBadge>
  );
}
