import clsx from "clsx";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

import {
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import {
  ResetPasswordMutationVariables,
  useResetPasswordMutation,
} from "../../../../generated/graphql";
import validate from "../../../../helper/validate";
import Loading from "../../../Loading";
import Index from "../Index";
import { schemaResetPassword as schema } from "../schema";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      marginLeft: theme.spacing(1),
    },
    margin: {
      margin: theme.spacing(1),
    },
    textField: {
      flexBasis: 200,
    },
  })
);
const message = {
  ok: "Şifreniz değiştirildi",
  code104: {
    message: "Hatalı istek.",
    variant: "error",
  },
  code102: {
    message: "Böyle bir kullanıcı bulunamadı.",
    variant: "error",
  },
  failed: { message: "İşlem başarısız.", variant: "error" },
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPasswordForm() {
  const query = useQuery();
  const token = query.get("token");
  const _id = query.get("_id");
  if (!token || !_id) throw new Error("");
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
  };
  const [runMutation, { loading, data }] = useResetPasswordMutation({
    onCompleted: () => {},
  });
  const [errors, setErrors] = React.useState<
    Partial<ResetPasswordMutationVariables>
  >({});
  const isValidToken = () => {
    if (data) {
      console.log(data);

      return !data.resetPassword.success;
    }
  };
  const isSuccess = () => {
    return !!data && data.resetPassword.success;
  };

  const [variables, setVariables] = React.useState<
    ResetPasswordMutationVariables
  >({ token, _id });
  React.useEffect(() => {
    if (!data) runMutation({ variables });
  }, [runMutation, variables, data]);
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setVariables({ ...variables, password: e.currentTarget?.value || "" });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validateError = validate(variables, schema);
    if (validateError) {
      setErrors(validateError);
      return;
    }
    runMutation({
      variables,
    });
  };
  return (
    <Index title="Şifre Değiştirme">
      <form className={classes.form} onSubmit={handleSubmit}>
        {loading && <Loading />}
        {isValidToken() && !isSuccess() && (
          <>
            <input
              type="text"
              name="email"
              style={{ display: "none" }}
              autoComplete="email"
            />
            <FormControl
              fullWidth
              className={clsx(classes.margin, classes.textField)}
            >
              <InputLabel htmlFor="password">{t("password")}</InputLabel>
              <Input
                required
                error={!!errors.password}
                id="password"
                value={variables.password || ""}
                onChange={handleChange}
                autoComplete="new-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Typography color="error">{errors?.password}</Typography>
            </FormControl>
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
                {t("button.change")}
              </Button>
            </Grid>
          </>
        )}
      </form>
      {isSuccess() && <Typography>{message.ok}</Typography>}
    </Index>
  );
}
