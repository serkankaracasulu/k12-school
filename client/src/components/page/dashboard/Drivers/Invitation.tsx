import * as React from "react";

import { Chip, IconButton, InputBase, Paper } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import SendIcon from "@material-ui/icons/Send";

import {
  DriverApplicationsQuery,
  DriverApplicationsQueryVariables,
  useInvitationDriversMutation,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import { useFocus } from "../../../../helper/useFocus";
import validate from "../../../../helper/validate";
import DialogWrapper from "../../../DialogW";
import { SetSnackBarProp } from "../../../myTypes";
import messageBox from "./messageBox";
import schema, { emailSchema } from "./schema";
import { DriverApplicationsDocument } from "./../../../../generated/graphql";

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
type PropsType = {
  setOpen(): void;
  setPr: SetSnackBarProp;
};
export default function Index(props: PropsType) {
  const { setOpen, setPr } = props;
  const [emails, setEmails] = React.useState<string[]>([]);
  const [emailInput, setEmailInput] = React.useState("");

  const [invitation, { loading }] = useInvitationDriversMutation({
    onCompleted: () => generateSuccess(setPr, messageBox),
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const classes = useStyles();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
      setEmailInput(e.currentTarget.value);
      const splitEmails = e.currentTarget.value.split(" ");
      const validEmails: string[] = [];
      const remainEmails: string[] = [];
      if (splitEmails.length > 1) {
        let fEmails: string[] = [];
        if (splitEmails[splitEmails.length - 1] !== " ") {
          fEmails = splitEmails.slice(0, splitEmails.length - 1);
        }
        fEmails = fEmails.filter((fe) => fe !== "");
        fEmails.forEach((fe) => {
          const { error } = emailSchema.validate(fe);
          if (!error) {
            validEmails.push(fe);
          } else remainEmails.push(fe);
        });
      }
      if (validEmails && validEmails.length > 0) {
        setEmails([...emails, ...validEmails]);
        let value = ` ${e.currentTarget.value}`;
        validEmails.forEach((fe) => {
          value = value.replace(` ${fe} `, "");
        });
        setEmailInput(remainEmails.join(" "));
      } else setEmailInput(e.currentTarget.value);
    } else setEmailInput("");
  };
  const handleDelete = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };
  const handleInvitation = () => {
    const lastEmail = inputRef && inputRef.current && inputRef.current.value;
    const { error } = emailSchema.validate(lastEmail);
    const variables =
      !error && lastEmail ? { emails: [...emails, lastEmail] } : { emails };
    const validateErrors = validate(variables, schema);
    if (validateErrors) {
      generateValidateError(setPr, validateErrors);
      return;
    }
    invitation({
      variables,
      update: (cache, result) => {
        if (result.data) {
          const { invitationDrivers } = result.data;
          cache.writeQuery<
            DriverApplicationsQuery,
            DriverApplicationsQueryVariables
          >({
            query: DriverApplicationsDocument,
            data: { driverApplications: invitationDrivers },
          });
        }
      },
    });
  };
  const [inputRef, setInputFocus] = useFocus();
  return (
    <DialogWrapper
      title="Davetiye gönder"
      setOpen={setOpen}
      maxWidth="lg"
      loading={loading}
    >
      <div onClick={setInputFocus}>
        <Paper className={classes.inputContainer}>
          <div className={classes.inputContainer1}>
            <EmailIcon
              color="primary"
              className={classes.icon}
              onClick={setInputFocus}
            />
            <InputBase
              id="email"
              onChange={handleChange}
              value={emailInput}
              inputRef={inputRef}
              placeholder="E-mail"
              className={classes.input}
            />
            <IconButton onClick={handleInvitation} disabled={loading}>
              <SendIcon color="primary" />
            </IconButton>
          </div>
          <Paper className={classes.root} elevation={0}>
            {emails.map((e) => (
              <Chip
                key={e}
                label={e}
                onDelete={() => {
                  handleDelete(e);
                }}
              />
            ))}
          </Paper>
        </Paper>
      </div>
    </DialogWrapper>
  );
}
