import * as React from "react";

import {
  Divider,
  Grow,
  LinearProgress,
  List,
  ListItemText,
  ListSubheader,
  Typography,
} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  InboxFragment,
  PersonKind,
  useMessagesQuery,
} from "../../../generated/graphql";
import getUserToken from "../../../helper/getUserToken";
import StudentAvatar from "../dashboard/StudentAvatar";
import UserProfileAvatar from "../dashboard/UserAvatar";
import MessageListItem from "./MessageListItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "@keyframes back": {
      from: { backgroundColor: theme.palette.action.selected },
      to: { backgroundColor: "inherit" },
    },
    listroot: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      overflowY: "auto",
      height: "100%",
    },
    inline: {
      display: "inline",
    },
    target: {
      animationName: "$back",
      animationDuration: "0.5s",
      animationTimingFunction: "linear",
      animationIterationCount: 4,
    },
    name: {
      fontWeight: 600,
    },
    nameList: {
      overflow: "hidden",
    },
    subHeader: {
      paddingTop: theme.spacing(1),
    },
    userContainer: {
      display: "flex",
      overflow: "auto",
      flexWrap: "nowrap",
      "& > *": {
        marginRight: theme.spacing(2),
      },
    },
  })
);
const maxFetch = 15;
type PropsType = {
  inbox: InboxFragment;
};

export default function MessageList(props: PropsType) {
  const { inbox } = props;
  const classes = useStyles();
  const [skip, setSkip] = React.useState(0);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const [isFetching, setIsFetching] = React.useState(false);
  const bottomDiv = React.useRef<HTMLDivElement | null>(null);
  const user = getUserToken();

  const { data, loading, fetchMore } = useMessagesQuery({
    variables: { inboxId: inbox._id, skip: 0 },
    onError: () => {},
  });

  function goBottom() {
    if (bottomDiv && bottomDiv.current)
      bottomDiv.current.scrollIntoView({ behavior: "smooth" });
  }
  const goBottomCallback = React.useCallback(() => {
    if (
      (data && data.messages.length <= maxFetch) ||
      (data && data.messages.some((m) => m._id === "newId")) ||
      skip === 0
    ) {
      goBottom();
    }
  }, [data, skip]);
  React.useEffect(() => {
    goBottomCallback();
  }, [goBottomCallback]);

  const handleFetchMore = () => {
    setIsFetching(true);
    fetchMore({
      variables: { skip: data ? data.messages.length : 0 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          messages: [...prev.messages, ...fetchMoreResult.messages],
        };
      },
    }).then((tData) => {
      setIsFetching(false);
      if (listRef && listRef.current && tData.data?.messages.length !== 0)
        listRef.current.scrollTop = 20;
    });
  };
  const targetId = "id1";
  const handleOnTop = (e: React.UIEvent<HTMLUListElement>) => {
    if (
      e.currentTarget.scrollTop === 0 &&
      data &&
      data.messages.length >= maxFetch
    ) {
      setSkip(data.messages.length);
      handleFetchMore();
    }
  };

  return (
    <List
      className={classes.listroot}
      onScroll={handleOnTop}
      ref={listRef}
      subheader={
        <ListSubheader className={classes.subHeader}>
          {user && (
            <div className={classes.userContainer}>
              {inbox &&
                inbox.users
                  .filter((u) => u._id !== user._id)
                  .map((user) => (
                    <div key={user._id}>
                      {user.kind === PersonKind.Student ? (
                        <StudentAvatar studentId={user._id} />
                      ) : (
                        <UserProfileAvatar personId={user._id} />
                      )}

                      <Typography
                        className={classes.name}
                        color="textPrimary"
                        align="center"
                      >
                        {user.fullName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        align="center"
                      >
                        {user.kind}
                      </Typography>
                    </div>
                  ))}
            </div>
          )}
          <Divider />
        </ListSubheader>
      }
    >
      {(loading || isFetching) && (
        <ListItem>
          <ListItemText>
            <LinearProgress />
          </ListItemText>
        </ListItem>
      )}
      {data &&
        data.messages
          .slice(0)
          .reverse()
          .map((message) => (
            <React.Fragment key={message._id}>
              {targetId === message._id ? (
                <Grow in={true} timeout={1000}>
                  <MessageListItem message={message} />
                </Grow>
              ) : (
                <MessageListItem message={message} />
              )}
            </React.Fragment>
          ))}
      <div style={{ float: "left", clear: "both" }} ref={bottomDiv}></div>
    </List>
  );
}
