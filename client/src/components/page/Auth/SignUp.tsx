import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link as RauterLink, useLocation } from "react-router-dom";

import { Button, Grid, TextField, Typography } from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  CreateUserInput,
  useCreateUserMutation,
} from "../../../generated/graphql";
import validate from "../../../helper/validate";
import Loading from "../../Loading";
import Message from "../../Message";
import Index from "./Index";
import { schemaSignUp as schema } from "./schema";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
export default function SignUp() {
  const query = useQuery();
  const token = query.get("token");
  const email = query.get("email");
  const { t } = useTranslation();
  const [errors, setErrors] = React.useState<Partial<CreateUserInput>>({});
  const classes = useStyles();
  const firstNameRef = React.useRef<HTMLInputElement | null>(null);
  const lastNameRef = React.useRef<HTMLInputElement | null>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);
  const emailRef = React.useRef<HTMLInputElement | null>(null);
  console.log(email);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setErrors({});
    if (
      firstNameRef.current &&
      lastNameRef.current &&
      emailRef.current &&
      passwordRef.current
    ) {
      const variables: CreateUserInput = {
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        email: email || emailRef.current.value,
        password: passwordRef.current.value,
      };
      if (token) variables.token = token;
      e.preventDefault();
      const error = validate(variables, schema);
      if (error) {
        setErrors(error);
        return;
      }
      createuser({
        variables,
      });
    }
  };

  const [createuser, { loading, error, data }] = useCreateUserMutation({
    onError: () => {},
  });
  if (data && data.createUser)
    return (
      <Message title={data.createUser.email!} message="Hesabınız oluşturuldu" />
    );
  return (
    <Index title={t("auth.signUpTitle")}>
      <form className={classes.form} onSubmit={handleSubmit}>
        {loading && <Loading />}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              inputRef={firstNameRef}
              autoComplete="fname"
              name="firstName"
              variant="outlined"
              required
              fullWidth
              id="firstName"
              label={t("firstName")}
              autoFocus
              error={Boolean(errors.firstName)}
              helperText={errors.firstName ? errors.firstName : null}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              inputRef={lastNameRef}
              variant="outlined"
              required
              fullWidth
              id="lastName"
              label={t("lastName")}
              name="lastName"
              autoComplete="lname"
              error={Boolean(errors.lastName)}
              helperText={errors.lastName ? errors.lastName : null}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              inputRef={emailRef}
              variant="outlined"
              required
              disabled={Boolean(email)}
              fullWidth
              defaultValue={email}
              label={t("email")}
              name="email"
              autoComplete="email"
              error={Boolean(errors.email)}
              helperText={errors.email ? errors.email : null}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              inputRef={passwordRef}
              variant="outlined"
              required
              fullWidth
              name="password"
              label={t("password")}
              type="password"
              autoComplete="current-password"
              error={Boolean(errors.password)}
              helperText={errors.password ? errors.password : null}
            />
          </Grid>
        </Grid>
        {error && error.graphQLErrors && (
          <Typography color="error">Üzgünüz bir hata oluştu </Typography>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          {t("auth.signUpButton")}
        </Button>
        <Grid container justify="flex-end">
          <Grid item>
            <RauterLink to="signin">
              {t("auth.alreadyHaveAnAccount")}
            </RauterLink>
          </Grid>
          <Grid item>
            <RauterLink to="isignup">{t("auth.schoolOwner")}</RauterLink>
          </Grid>
        </Grid>
      </form>
    </Index>
  );
}
