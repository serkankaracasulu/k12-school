import * as React from "react";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";

import {
  LessonMessageType,
  SendLessonMessageMutationVariables,
  useSendLessonMessageMutation,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../helper/generateMessage";
import validate from "../../../../helper/validate";
import Context from "../../../Context";
import { KeysMatching } from "../../../myTypes";
import messageBox from "../messageBox";
import schema from "../schema";

type PropsType = {
  setOpen?: () => void;
  title?: string;
  lessonId: string;
  messageType?: LessonMessageType;
};
const useStyles = makeStyles((theme: Theme) => ({
  button: {
    marginTop: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  action: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: theme.spacing(1),
  },
  formControl: {
    marginRight: theme.spacing(2),
  },
}));

export default function (props: PropsType) {
  const { lessonId } = props;
  const [messageType, setMessageType] = React.useState(
    LessonMessageType.Announcement
  );
  const { setPr } = React.useContext(Context);
  const classes = useStyles();
  const [send, { loading }] = useSendLessonMessageMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      //setOpen();
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const [validateErrors, setValidateErrors] = React.useState<
    KeysMatching<SendLessonMessageMutationVariables>
  >({});
  const messageRef = React.useRef<HTMLInputElement | null>(null);
  const titleRef = React.useRef<HTMLInputElement | null>(null);
  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageRef.current && titleRef.current) {
      const variables: SendLessonMessageMutationVariables = {
        lessonId,
        messageType,
        message: messageRef.current.value,
        title: titleRef.current.value,
      };
      const validateError = validate(variables, schema);
      if (validateError) {
        setValidateErrors(validateError);
        return;
      } else setValidateErrors({});
      send({ variables });
    }
  };
  return (
    <form onSubmit={handleSend}>
      <TextField
        label="Başlık"
        variant="outlined"
        inputRef={titleRef}
        required
        fullWidth
        helperText={validateErrors.title}
        className={classes.title}
      />
      <TextField
        label="Mesaj"
        multiline
        required
        rows="7"
        helperText={validateErrors.message}
        variant="outlined"
        fullWidth
        inputRef={messageRef}
      />
      <div className={classes.action}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Mesaj tipi</InputLabel>
          <Select
            required
            value={messageType}
            onChange={(e) =>
              setMessageType(e.target.value as LessonMessageType)
            }
          >
            <MenuItem value={LessonMessageType.Announcement}>Duyuru</MenuItem>
            <MenuItem value={LessonMessageType.Homework}>Ödev</MenuItem>
          </Select>
        </FormControl>
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
