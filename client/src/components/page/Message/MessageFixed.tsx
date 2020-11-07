import * as React from "react";

import { Button, IconButton } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import { Close as CloseIcon } from "@material-ui/icons";

import { useInboxQuery, usePersonLazyQuery } from "../../../generated/graphql";
import Context from "../../Context";
import MessageList from "./MessageList";
import Send from "./Send";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: "fixed",
      right: 0,
      bottom: 0,
      height: 500,
      zIndex: 5000,
      width: 400,
      border: "1px solid rgba(128, 0, 128, 0.3)",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
      },
    },
    root: {
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    messageListContainer: {
      height: "100%",
      backgroundColor: "white",
    },
    header: {
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: purple[500],
      "&:hover": {
        backgroundColor: purple[700],
      },
      display: "flex",
    },
    close: {
      color: "white",
    },
  })
);

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: "transparent",
    width: "100%",
  },
}))(Button);

export default function MessageFixed() {
  const classes = useStyles();
  const { toState } = React.useContext(Context);
  const [to, setTo] = toState;
  const { data, refetch } = useInboxQuery({
    variables: { to: (to && [to]) || [] },
    onError: () => {},
  });
  const [getUser, { data: dataUser }] = usePersonLazyQuery({
    onError: () => {},
  });
  React.useEffect(() => {
    if (!to) return;
    getUser({ variables: { personId: to } });
  }, [to, getUser]);
  const handleNew = () => {
    refetch();
  };
  if (to)
    return (
      <div className={classes.container}>
        <div className={classes.root}>
          <div className={classes.header}>
            <ColorButton>{dataUser?.person.fullName}</ColorButton>
            <IconButton size="small" onClick={() => setTo("")}>
              <CloseIcon className={classes.close} />
            </IconButton>
          </div>
          <div className={classes.messageListContainer}>
            {data && <MessageList inbox={data.inbox} />}
          </div>
          <Send
            inboxId={data?.inbox._id || "new"}
            to={[to]}
            isNewCallback={!data ? handleNew : undefined}
          />
        </div>
      </div>
    );
  return <span />;
}
