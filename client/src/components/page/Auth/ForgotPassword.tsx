import * as React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/";

import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { useForgotPasswordMutation } from "../../../generated/graphql";
import Loading from "../../Loading";
import MessageBox from "../../MessageContainer";
import Index from "./Index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      marginLeft: theme.spacing(1),
    },
  })
);
const message = {
  ok: "Sıfırlama linkini adresinize gönderdik",
  c102: "Email adresi bulunamadı",
};
export default function ForgotPassword() {
  const { t } = useTranslation();
  const history = useHistory();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailEl.current && emailEl.current.value;
    email &&
      forgotPassword({
        variables: {
          email,
        },
      });
  };

  const [forgotPassword, { loading, error, data }] = useForgotPasswordMutation({
    onCompleted: () => {},
    onError: () => {},
  });
  const classes = useStyles();
  const emailEl = React.useRef<HTMLInputElement | null>(null);
  return (
    <Index title={t("auth.forgotPasswordTitle")}>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        {loading && <Loading />}
        {data ? (
          <MessageBox message={message.ok} />
        ) : (
          <>
            <TextField
              inputRef={emailEl}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label={t("email")}
              name="email"
              autoComplete="email"
              autoFocus
            />

            {error && <Typography color="error">{message.c102}</Typography>}
            <Grid justify="flex-end" container>
              <Button
                variant="text"
                onClick={() => history.push("/signin")}
                className={classes.submit}
              >
                {t("button.cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {t("button.send")}
              </Button>
            </Grid>
          </>
        )}
      </form>
    </Index>
  );
}
