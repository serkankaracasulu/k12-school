import * as React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Button, TextField } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

import {
  StudentSignInMutationVariables,
  useActiveStudentQuery,
  useStudentSignInMutation,
} from "../../../generated/graphql";
import validate from "../../../helper/validate";
import Loading from "../../Loading";
import Index from "../Auth/Index";
import schema from "./schema";

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const message = {
  c102: "Eposta veya şifre yanlış",
};
export default function SignIn() {
  const { t } = useTranslation();
  const history = useHistory();
  const [errors, setErrors] = React.useState<
    Partial<StudentSignInMutationVariables>
  >();
  const { refetch, loading: aLoading } = useActiveStudentQuery();
  const [variables, setVariables] = React.useState<
    StudentSignInMutationVariables
  >({
    username: "",
    password: "",
  });
  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVariables({ ...variables, [name]: event.currentTarget.value });
  };
  const [error, setError] = React.useState("");
  const classes = useStyles();
  const [signinUser, { loading }] = useStudentSignInMutation({
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
      localStorage.setItem("token", tData.studentSignIn.token);
      refetch().then(({ data }) => {
        if (data && data.activeStudent) history.push("/student");
      });
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validateError = validate(variables, schema);
    if (validateError) {
      setErrors(validateError);
      return;
    }
    signinUser({
      variables,
    });
  };

  return (
    <Index title={t("auth.signInTitle")}>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        {loading && <Loading />}
        {aLoading && <Loading />}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          onChange={handleChange("username")}
          error={Boolean(errors?.username)}
          helperText={errors?.username ? errors.username : null}
          label="Kullanıcı adi"
          name="username"
          id="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          error={Boolean(errors?.password)}
          helperText={errors?.password ? errors.password : null}
          fullWidth
          onChange={handleChange("password")}
          name="password"
          label={t("password")}
          type="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          {t("auth.signInButton")}
        </Button>
      </form>
      {error && message.c102}
    </Index>
  );
}
