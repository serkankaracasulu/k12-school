import * as React from "react";
import { useTranslation } from "react-i18next";

import { Button, Grid, TextField, Typography } from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import validate from "../../../../helper/validate";
import Loading from "../../../Loading";
import Message from "../../../Message";
import schema from "./schema";
import {
  CreateInstUserMutationVariables,
  useCreateInstUserMutation,
} from "./../../../../generated/graphql";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    buttons: {
      display: "flex",
      justifyContent: "flex-end",
    },
    button: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(1),
    },
  })
);
const message = {
  cOk: "Hesabınız oluşturuldu",
  c100u: "Bu kullanıcı zaten var",
  c100i: "Bu isimde kayıtlı firma zaten var",
  cBAD_USER_INPUT: "Hatalı veya eksik bilgi",
};
type PropsType = {
  next(): void;
  back(): void;
};

export default function InstitutionSignUp(props: PropsType) {
  const { next, back } = props;
  const { t } = useTranslation();
  const [errors, setErrors] = React.useState<
    Partial<CreateInstUserMutationVariables>
  >({});
  const [result, setResult] = React.useState<
    "cOk" | "c100u" | "c100i" | "cBAD_USER_INPUT" | ""
  >("");
  const classes = useStyles();
  const [createuser, { loading, data }] = useCreateInstUserMutation({
    onError: (err) => {
      if (err.graphQLErrors.length > 0) {
        if (err.graphQLErrors[0].extensions) {
          const { code } = err.graphQLErrors[0].extensions;
          if (err.graphQLErrors[0].extensions.exception.isUser) {
            setResult("c100u");
          } else if (err.graphQLErrors[0].extensions.exception.isInstitution) {
            setResult("c100i");
          } else setResult(code);
        }
      }
    },
    onCompleted: () => {
      setResult("cOk");
      next();
    },
  });
  const [values, setValues] = React.useState<CreateInstUserMutationVariables>({
    firstName: "",
    lastName: "",
    institutionName: "",
    email: "",
    phone: "",
    password: "",
    token: "",
  });
  const variables = {
    firstName: values.firstName,
    lastName: values.lastName,
    institutionName: values.institutionName,
    email: values.email,
    phone: values.phone,
    password: values.password,
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setErrors({});
    e.preventDefault();
    const error = validate(variables, schema);
    if (error) {
      setErrors(error);
      return;
    }
    createuser({
      variables,
    });
  };
  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({ ...values, [name]: event.currentTarget.value });
  };
  if (data)
    return <Message title={data.createInst.email} message={message.cOk} />;
  return (
    <>
      {loading && <Loading />}
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              onChange={handleChange("firstName")}
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
              onChange={handleChange("lastName")}
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
              onChange={handleChange("institutionName")}
              variant="outlined"
              required
              fullWidth
              id="institutionName"
              label={t("institutionName")}
              name="institutionName"
              autoComplete="institution"
              error={Boolean(errors.institutionName)}
              helperText={
                errors.institutionName ? errors.institutionName : null
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={handleChange("email")}
              variant="outlined"
              required
              fullWidth
              label={t("email")}
              name="email"
              autoComplete="email"
              error={Boolean(errors.email)}
              helperText={errors.email ? errors.email : null}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={handleChange("phone")}
              variant="outlined"
              required
              fullWidth
              label={t("phone")}
              name="phone"
              autoComplete="phone"
              error={Boolean(errors.phone)}
              helperText={errors.phone ? errors.phone : null}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={handleChange("password")}
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
        {result && <Typography color="error">{message[result]} </Typography>}
        <div className={classes.buttons}>
          <Button onClick={back} className={classes.button}>
            {t("button.back")}
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            className={classes.button}
          >
            {t("auth.signUpButton")}
          </Button>
        </div>
      </form>
    </>
  );
}
