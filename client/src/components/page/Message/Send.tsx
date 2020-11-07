import * as React from "react";

import {
  Button,
  CircularProgress,
  Divider,
  TextField,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";

import {
  MessagesDocument,
  MessagesQuery,
  MessagesQueryVariables,
  useSendMessageMutation,
} from "../../../generated/graphql";
import getMessageOptimistic from "../../../helper/getMessageOptimistic";

type PropsType = {
  to: string[];
  inboxId: string;
  isNewCallback?(id?: string): void;
};
const useStyles = makeStyles((theme: Theme) => ({
  button: {
    marginTop: theme.spacing(0),
  },
  message: {
    backgroundColor: "white",
  },
  action: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: theme.spacing(1),
  },
  form: { backgroundColor: theme.palette.grey[100] },
  formControl: {
    marginRight: theme.spacing(2),
  },
}));
const maxMessageLength = 600;
export default function SendMessageForm(props: PropsType) {
  const { to, inboxId, isNewCallback } = props;
  const classes = useStyles();
  const [message, setMesssage] = React.useState("");
  const [send, { loading }] = useSendMessageMutation({
    onError: () => {},
    onCompleted: (tData) => {
      if (isNewCallback) isNewCallback(tData.sendMessage.inboxId);
    },
  });
  const handleChangle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const end =
      e.currentTarget.value.length <= maxMessageLength
        ? e.currentTarget.value.length
        : maxMessageLength;
    setMesssage(e.currentTarget.value.substring(0, end));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message) {
      setMesssage("");
      send({
        variables: { message, to },
        update: (proxy, result) => {
          if (result && result.data && inboxId !== "new") {
            const messagesQuery = proxy.readQuery<
              MessagesQuery,
              MessagesQueryVariables
            >({
              query: MessagesDocument,
              variables: { inboxId: inboxId, skip: 0 },
            });
            if (messagesQuery) {
              proxy.writeQuery<MessagesQuery, MessagesQueryVariables>({
                query: MessagesDocument,
                variables: { inboxId, skip: 0 },
                data: {
                  messages: [
                    result.data.sendMessage,
                    ...messagesQuery.messages,
                  ],
                },
              });
            }
          }
        },
        optimisticResponse: {
          sendMessage: getMessageOptimistic(inboxId, message),
        },
      });
    }
  };
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Divider />
      <TextField
        label="Mesaj"
        multiline
        required
        className={classes.message}
        rows="4"
        variant="standard"
        fullWidth
        value={message}
        onChange={handleChangle}
      />
      <div className={classes.action}>
        <CircularProgress
          variant="static"
          value={
            message.length <= maxMessageLength
              ? (100 * message.length) / maxMessageLength
              : 100
          }
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          type="submit"
          disabled={loading}
          endIcon={<SendIcon />}
        >
          Gönder
        </Button>
      </div>
    </form>
  );
}
