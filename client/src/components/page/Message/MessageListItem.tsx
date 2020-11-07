import * as React from "react";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import StudentAvatar from "../dashboard/StudentAvatar";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import UserProfileAvatar from "../dashboard/UserAvatar";
import { DateTime } from "luxon";
import getUserToken from "../../../helper/getUserToken";
import {
  MessageFragment,
  PersonKind,
  UnReadMessageCountDocument,
  UnReadMessageCountQuery,
  UnReadMessageCountQueryVariables,
} from "../../../generated/graphql";
import { useMessageReadMutation } from "./../../../generated/graphql";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    time: {
      marginLeft: theme.spacing(1),
      "&::before": {
        content: "'•'",
        marginRight: theme.spacing(1),
      },
    },
    name: {
      fontWeight: 600,
    },
    progress: {
      marginLeft: theme.spacing(1),
    },
    unRead: {
      backgroundColor: theme.palette.grey[100],
    },
    avatar: {
      marginRight: theme.spacing(2),
    },
    listItem: {
      paddingLeft: theme.spacing(1),
    },
  })
);
type PropsType = {
  message: MessageFragment;
};
export default function MessageListItem({ message }: PropsType) {
  const classes = useStyles();
  const user = getUserToken();
  const ref = React.useRef<HTMLDivElement>(null);
  function isMessageRead(message: MessageFragment) {
    return !!user && !message.idOfUnReaders.includes(user._id);
  }
  const [read] = useMessageReadMutation({
    onError: () => {},
  });
  React.useEffect(() => {
    if (user && message.idOfUnReaders.includes(user._id))
      read({
        variables: { messageId: message._id },
        update: (query, result) => {
          if (!result.data?.messageRead.success) return;
          try {
            const countQuery = query.readQuery<
              UnReadMessageCountQuery,
              UnReadMessageCountQueryVariables
            >({
              query: UnReadMessageCountDocument,
            });
            if (!countQuery || countQuery.unReadMessageCount < 1) return;
            query.writeQuery<
              UnReadMessageCountQuery,
              UnReadMessageCountQueryVariables
            >({
              query: UnReadMessageCountDocument,
              data: { unReadMessageCount: countQuery.unReadMessageCount - 1 },
            });
          } catch (error) {
            //
          }
        },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ListItem
      className={!isMessageRead(message) ? classes.unRead : ""}
      innerRef={ref}
    >
      <ListItemAvatar className={classes.avatar}>
        {message.owner?.kind === PersonKind.Student ? (
          <StudentAvatar studentId={message.ownerId} size="small" />
        ) : (
          <UserProfileAvatar personId={message.ownerId} size="small" />
        )}
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <Typography component="span" className={classes.name}>
              {message.owner?.fullName}
            </Typography>
            <Typography
              component="time"
              dateTime={message.sent}
              className={classes.time}
              color="textSecondary"
              variant="caption"
            >
              {DateTime.fromISO(message.sent).toLocaleString({
                weekday: "short",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
            {message._id === "newId" && (
              <CircularProgress
                className={classes.progress}
                style={{ height: 15, width: 15 }}
              />
            )}
          </>
        }
        secondary={<Typography>{message.message}</Typography>}
      />
    </ListItem>
  );
}
