import * as React from "react";

import { Button, DialogActions, TextField } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  SendHomeWorkMutationVariables,
  useSendHomeWorkMutation,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../helper/generateMessage";
import validate from "../../../../helper/validate";
import Context from "../../../Context";
import DialogWrapper from "../../../DialogW";
import { KeysMatching } from "../../../myTypes";
import messageBox from "../messageBox";
import { homeworkSchema } from "../schema";

type PropsType = {
  setOpen(): void;
  title: string;
  lessonId: string;
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing(1),
    },
  })
);

export default function (props: PropsType) {
  const { setOpen, title, lessonId } = props;
  const { setPr } = React.useContext(Context);
  const [validateErrors, setValidateErrors] = React.useState<
    KeysMatching<SendHomeWorkMutationVariables>
  >({});
  const classes = useStyles();
  const [send, { loading }] = useSendHomeWorkMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      setOpen();
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const messageRef = React.useRef<HTMLInputElement | null>(null);
  const titleRef = React.useRef<HTMLInputElement | null>(null);
  const fileRef = React.useRef<null | HTMLInputElement>(null);
  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [fileData] =
      fileRef.current && fileRef.current.files ? fileRef.current.files : [];
    const variables: SendHomeWorkMutationVariables = {
      message: messageRef.current ? messageRef.current.value : "",
      lessonId,
      title: titleRef.current ? titleRef.current.value : "",
      homeWorkFile:
        fileRef.current &&
        fileRef.current.validity &&
        fileRef.current.validity.valid
          ? fileData
          : undefined,
    };
    const validateError = validate(variables, homeworkSchema);
    if (validateError) {
      setValidateErrors(validateError);
      return;
    } else setValidateErrors({});
    send({ variables });
  };
  return (
    <DialogWrapper
      setOpen={setOpen}
      title={title}
      maxWidth="sm"
      loading={loading}
    >
      <form onSubmit={handleSend}>
        <TextField
          label="Başlık"
          variant="outlined"
          inputRef={titleRef}
          fullWidth
          required
          margin="normal"
          helperText={validateErrors.title}
        />
        <TextField
          label="Mesaj"
          multiline
          rows="7"
          variant="outlined"
          fullWidth
          required
          helperText={validateErrors.message}
          inputRef={messageRef}
          margin="normal"
        />
        <input type="file" id="logo" ref={fileRef} />
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            type="submit"
            disabled={loading}
          >
            Gönder
          </Button>
        </DialogActions>
      </form>
    </DialogWrapper>
  );
}
