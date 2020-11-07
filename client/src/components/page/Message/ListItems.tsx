/* eslint-disable react/display-name */
import { DateTime } from "luxon";
import pather from "path";
import * as React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CreateIcon from "@material-ui/icons/Create";

import {
  InboxFragment,
  InboxsQuery,
  PersonKind,
  useInboxsQuery,
} from "../../../generated/graphql";
import getInboxUsers from "../../../helper/getInboxUsers";
import getUserToken from "../../../helper/getUserToken";
import ListItemLink from "../../ListItemLink";
import StudentAvatar from "../dashboard/StudentAvatar";
import UserProfileAvatar from "../dashboard/UserAvatar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      overflow: "hidden",
    },
    newMessage: {
      marginLeft: theme.spacing(1),
      fontWeight: 700,
      "&::before": {
        content: "'•'",
        marginRight: theme.spacing(1),
      },
    },
    ListItemLink: {
      marginRight: theme.spacing(2),
      paddingLeft: theme.spacing(1),
      [theme.breakpoints.down("xs")]: { paddingLeft: theme.spacing(0) },
    },
    avatarContainer: {
      "& :nth-child(2n)": {
        marginTop: "-20px",
        marginLeft: "20px",
      },
      "& :nth-child(3)": {
        marginTop: "-30px",
      },
    },
    avatar: {
      marginRight: theme.spacing(2),
    },
  })
);
const limit = 10;
export default function MainListItems() {
  const { url } = useRouteMatch();
  const classes = useStyles();
  const history = useHistory();
  const { data, fetchMore } = useInboxsQuery({
    variables: { skip: 0 },
    fetchPolicy: "cache-and-network",
  });
  const [selectedPage, setSelectedPage] = React.useState(
    history.location.pathname
  );

  const handleSelect = (page: string) => {
    setSelectedPage(page);
  };
  const handleBottom = (e: React.UIEvent<HTMLDivElement>) => {
    if (
      data &&
      data.inboxs.length >= limit &&
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
        e.currentTarget.clientHeight
    ) {
      handleFetchMore();
    }
  };
  const handleFetchMore = () => {
    fetchMore({
      variables: { skip: data ? data.inboxs.length : 0 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          inboxs: [...fetchMoreResult.inboxs, ...prev.inboxs],
        };
      },
    });
  };
  const handleNewMessage = () => {
    history.push(pather.join(url, "new"));
    setSelectedPage(history.location.pathname);
  };
  return (
    <div className={classes.list} onScroll={handleBottom}>
      <ListItem>
        <ListItemText
          primary={<Typography variant="h6">Mesajlaşma</Typography>}
        />
        <ListItemSecondaryAction>
          <IconButton color="primary" onClick={handleNewMessage}>
            <CreateIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      {data &&
        data.inboxs.map((inbox) => {
          const userNames = getInboxUsers(inbox.users);
          return (
            <ListItemLink
              key={inbox._id}
              to={pather.join(url, inbox._id)}
              className={classes.ListItemLink}
              primary={userNames}
              icon={
                <div className={classes.avatar}>
                  <MessageItemAvatas users={inbox.users} />
                </div>
              }
              handleSelect={handleSelect}
              selectedPage={selectedPage}
              secondary={
                <>
                  <Typography component="span" display="block">
                    {inbox.lastMessage}
                  </Typography>
                  <Typography variant="caption">
                    {DateTime.fromISO(inbox.updatedAt).toLocaleString()}
                  </Typography>
                  {isNewMessage(inbox) && (
                    <Typography
                      variant="caption"
                      color="error"
                      className={classes.newMessage}
                    >
                      {inbox.unReadCount} Yeni mesaj
                    </Typography>
                  )}
                </>
              }
            />
          );
        })}
    </div>
  );

  function isNewMessage(inbox: InboxFragment) {
    return !!inbox.unReadCount;
  }
}
type ItemProps = {
  users: InboxsQuery["inboxs"][0]["users"];
  size?: "inherit" | "default" | "large" | "small" | undefined;
};
function MessageItemAvatas(props: ItemProps) {
  const user = getUserToken();
  const classes = useStyles();
  const { users } = props;
  const usersWitoutMe = users.filter((u) => u._id !== user?._id);

  if (usersWitoutMe.length === 1)
    return (
      <>
        {usersWitoutMe.map((user) => {
          if (user.kind === PersonKind.Student)
            return (
              <StudentAvatar
                studentId={user._id}
                key={user._id}
                size={props.size}
              />
            );
          else
            return (
              <UserProfileAvatar
                personId={user._id}
                key={user._id}
                size={props.size}
              />
            );
        })}
      </>
    );
  return (
    <div className={classes.avatarContainer}>
      {[...usersWitoutMe].splice(0, 2).map((user) => {
        if (user.kind === PersonKind.Student)
          return (
            <StudentAvatar key={user._id} studentId={user._id} size="small" />
          );
        else
          return (
            <UserProfileAvatar
              key={user._id}
              personId={user._id}
              size="small"
            />
          );
      })}
      {usersWitoutMe.length > 2 && (
        <Avatar> +{usersWitoutMe.length - 2}</Avatar>
      )}
    </div>
  );
}
