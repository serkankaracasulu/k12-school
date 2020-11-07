import * as React from "react";

import {
  Button,
  Container,
  Grid,
  LinearProgress,
  TextField,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import PasswordIcon from "@material-ui/icons/Lock";

import { useChangePasswordMutation } from "../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../helper/generateMessage";
import validate from "../../../helper/validate";
import MainBottomBar from "../../MainBottomBar";
import { KeysMatching, SnackBarProp } from "../../myTypes";
import SnackBar from "../../SnackBar";
import MainAppBar from "../pricing/MainAppBar";
import schema from "./schema";

const messageBox = {
  success: { message: "Şifre değiştirildi.", variant: "success" },
  failed: { message: "Şifre değiştirilemedi.", variant: "error" },
  UNAUTHENTICATED: { message: "Yetkisiz işlem", variant: "error" },
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      position: "relative",
    },
    appBarSpacer: theme.mixins.toolbar,
    header: {
      marginLeft: theme.spacing(2),
    },
  })
);

class ChangePasswordTvariables {
  password: string = "";
  rePassword: string = "";
}
export default function ChangePasswordForm() {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [variables, setVariables] = React.useState(
    new ChangePasswordTvariables()
  );
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  const [errors, setErrors] = React.useState<
    KeysMatching<ChangePasswordTvariables>
  >({});
  const [changePassword, { loading }] = useChangePasswordMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const handleChange = (name: keyof ChangePasswordTvariables) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVariables({ ...variables, [name]: event.currentTarget.value });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validateErros = validate(variables, schema);
    setErrors(validateErros || {});
    if (validateErros) return;
    changePassword({ variables });
  };
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      {loading && <LinearProgress />}
      <MainAppBar />
      <div className={classes.appBarSpacer} />
      <Container maxWidth="md" className={classes.container}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid
              container
              alignItems="center"
              spacing={2}
              className={classes.header}
            >
              <Grid item>
                <PasswordIcon color="action" />
              </Grid>
              <Grid item>
                <Typography variant="h5" gutterBottom color="textSecondary">
                  Şifreyi Değiştir
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <TextField
                label="Yeni Şifre"
                required
                type="password"
                helperText={errors.password}
                variant="outlined"
                value={variables.password}
                onChange={handleChange("password")}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Yeni Şifre Tekrar"
                required
                type="password"
                helperText={errors.rePassword}
                variant="outlined"
                value={variables.rePassword}
                onChange={handleChange("rePassword")}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                type="submit"
              >
                KAYDET
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      {fullScreen && <MainBottomBar />}
      <SnackBar pr={snackBarProp} setPr={setSnackBarProp} />
    </>
  );
}
