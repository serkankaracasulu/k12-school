import path from "path";
import * as React from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";

import { Container, LinearProgress } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { useInboxQuery } from "../../../generated/graphql";
import getUserToken from "../../../helper/getUserToken";
import AutocompleteStudent from "./AutocomplateSearh";
import MessageList from "./MessageList";
import SendMessage from "./Send";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "@keyframes back": {
      from: { backgroundColor: theme.palette.action.selected },
      to: { backgroundColor: "inherit" },
    },
    root: {
      marginTop: theme.spacing(3),
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(1),
        padding: 0,
      },
      height: `calc(100vh - ${
        theme.mixins.toolbar.minHeight
      }px * 2  - ${theme.spacing(5)}px)`,
      overflow: "hidden",
      [theme.breakpoints.down("sm")]: {
        height: `calc(100vh - 2 * ${
          theme.mixins.toolbar.minHeight
        }px - ${theme.spacing(5)}px)`,
      },
    },
    container: {
      height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
      display: "flex",
      flexDirection: "column",
    },
    form: {
      bottom: 0,
      left: 0,
    },
  })
);

type ParamType = {
  inboxId: string;
};

export default function MessagesContainer() {
  const classes = useStyles();
  const { url } = useRouteMatch();
  const history = useHistory();
  const { inboxId } = useParams<ParamType>();
  const [to, setTo] = React.useState<string[]>([]);
  const user = getUserToken();
  const { data, loading, error } = useInboxQuery({
    variables: {
      inboxId: inboxId !== "new" ? inboxId : undefined,
      to: to.length > 0 && inboxId === "new" ? to : undefined,
    },
    onCompleted: (tData) => {
      user &&
        setTo(
          tData.inbox.users
            .filter((userValue) => userValue._id !== user._id)
            .map((u) => u._id)
        );
    },
    onError: () => {},
  });
  React.useEffect(() => {
    if (inboxId === "new") setTo([]);
  }, [inboxId]);
  const handleNew = (id: string) => {
    const newPath = url.replace("new", "");
    history.push(path.join(newPath, id));
  };
  return (
    <Container maxWidth="md" className={classes.root}>
      {inboxId === "new" && <AutocompleteStudent setTo={setTo} />}
      <div className={classes.container}>
        <div style={{ height: "100%", backgroundColor: "white" }}>
          {loading && <LinearProgress />}
          {data && !loading && !error && <MessageList inbox={data.inbox} />}
        </div>
        {inboxId && (
          <div className={classes.form}>
            <SendMessage
              to={to}
              inboxId={inboxId}
              isNewCallback={inboxId === "new" ? handleNew : undefined}
            />
          </div>
        )}
      </div>
    </Container>
  );
}
