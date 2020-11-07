import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link as RauterLink } from "react-router-dom";

import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  SiginUserMutationVariables,
  useActiveUserQuery,
  useSiginUserMutation,
} from "../../../generated/graphql";
import nameof from "../../../helper/nameof";
import Loading from "../../Loading";
import Index from "./Index";
import ReSendConfirmEmail from "./ReSendConfirEmail";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);
const message = {
  c102: "Eposta veya şifre yanlış",
  c103: "Lütfen hesabınızı onaylayın. Onay için email almadınız mı?",
};
export default function SignIn() {
  const { t } = useTranslation();
  const { register, handleSubmit, errors, watch } = useForm<
    SiginUserMutationVariables
  >();
  const { email, password } = watch();
  const { refetch, loading: aLoading } = useActiveUserQuery();
  const [error, setError] = React.useState("");
  const classes = useStyles();
  const [signinUser, { loading }] = useSiginUserMutation({
    onError: (err) => {
      if (err.graphQLErrors.length > 0) {
        if (err.graphQLErrors[0].extensions) {
          const { code } = err.graphQLErrors[0].extensions;
          setError(code);
        }
      }
    },
    ignoreResults: false,
    onCompleted: (tData) => {
      localStorage.setItem("token", tData.signIn.token);
      refetch();
      window.location.href = "/";
    },
  });

  const handleSignIn: SubmitHandler<SiginUserMutationVariables> = ({
    email,
    password,
  }) => {
    const variables = {
      email: email,
      password: password,
    };
    signinUser({
      variables,
    }).then((d) => console.log(d));
  };
  return (
    <Index title={t("auth.signInTitle")}>
      <form className={classes.form} onSubmit={handleSubmit(handleSignIn)}>
        {loading && <Loading />}
        {aLoading && <Loading />}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          inputRef={register({
            pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
            required: true,
          })}
          error={!!errors.email}
          helperText={errors.email && "geçerli bir email adresi giriniz"}
          label={t("email")}
          name={nameof({ email })}
          autoComplete="email"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          error={!!errors.password}
          helperText={errors.password && "minimun 6 karakter şifre giriniz"}
          fullWidth
          inputRef={register({ minLength: 6, required: true })}
          name={nameof({ password })}
          label={t("password")}
          type="password"
          autoComplete="current-password"
        />
        {error === "103" && (
          <ReSendConfirmEmail email={email} password={password} />
        )}
        {error === "102" && <span>{message.c102}</span>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          {t("auth.signInButton")}
        </Button>
        <Grid container>
          <Grid item xs>
            <RauterLink to="/forgotpassword" style={{ textDecoration: "none" }}>
              <Typography variant="body2">
                {t("auth.forgotPassword")}
              </Typography>
            </RauterLink>
          </Grid>
          <Grid item>
            <RauterLink to="/signup" style={{ textDecoration: "none" }}>
              <Typography variant="body2">
                {t("auth.dontHaveAccount")}
              </Typography>
            </RauterLink>
          </Grid>
        </Grid>
      </form>
    </Index>
  );
}
