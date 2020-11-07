/* eslint-disable no-useless-escape */
/* eslint-disable react/prop-types */
import * as React from "react";
import {
  InputBase,
  Paper,
  IconButton,
  InputBaseProps,
  FormHelperText,
} from "@material-ui/core";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import SendIcon from "@material-ui/icons/Send";
import { useForm, SubmitHandler } from "react-hook-form";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import messageBox from "./messageBox";
import DialogWrapper from "../../../../DialogW";
import {
  generateError,
  generateSuccess,
} from "./../../../../../helper/generateMessage";
import Context from "../../../../Context";
import { useInvitationParentMutation } from "./../../../../../generated/graphql";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(0.5),
      },
      marginTop: theme.spacing(2),
      overflowX: "auto",
      color: "white",
    },
    inputContainer: {
      padding: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
    },
    input: {
      marginLeft: theme.spacing(1),
      flexGrow: 1,
    },
    title: {
      fontWeight: 200,
    },
    icon: {
      alignSelf: "center",
    },
    inputContainer1: {
      flex: "auto",
      display: "flex",
    },
  })
);

interface IParentInvitationPageProps {
  studentId: string;
  close(): void;
}
type InvitationParentTvariables = {
  studentId: string;
  email: string;
};

const ParentInvitationPage: React.FunctionComponent<IParentInvitationPageProps> = ({
  studentId,
  close,
}) => {
  const { register, handleSubmit, errors } = useForm<
    InvitationParentTvariables
  >();
  const { setPr } = React.useContext(Context);
  const [emailInput, setEmailInput] = React.useState("");
  const classes = useStyles();
  const handleChange: InputBaseProps["onChange"] = ({ target }) => {
    setEmailInput(target.value);
  };
  const [invite] = useInvitationParentMutation({
    onError: (tError) => generateError(tError, setPr, messageBox),
    onCompleted: (Tdata) => generateSuccess(setPr, messageBox),
  });

  const handleEdit: SubmitHandler<InvitationParentTvariables> = (data) => {
    invite({ variables: data });
  };
  return (
    <DialogWrapper
      title="Davetiye gönder"
      setOpen={close}
      maxWidth="lg"
      loading={false}
    >
      <div>
        <Paper className={classes.inputContainer}>
          <form onSubmit={handleSubmit(handleEdit)}>
            <div className={classes.inputContainer1}>
              <input
                name="studentId"
                value={studentId}
                type="hidden"
                required
                ref={register}
              />
              <EmailIcon
                color="primary"
                className={classes.icon}
                name="email"
              />
              <InputBase
                id="email"
                name="email"
                onChange={handleChange}
                value={emailInput}
                inputRef={register({
                  pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
                required
                error={!!errors.email}
                placeholder="E-mail"
                className={classes.input}
              />
              {errors.email && (
                <FormHelperText id="standard-weight-helper-text">
                  Geçerli bir email adrsi giriniz
                </FormHelperText>
              )}
              <IconButton type="submit" disabled={false}>
                <SendIcon color="primary" />
              </IconButton>
            </div>
          </form>
        </Paper>
      </div>
    </DialogWrapper>
  );
};

export default ParentInvitationPage;
