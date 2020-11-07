import * as pather from "path";
import * as React from "react";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";

import { Button, Container } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { SnackBarProp } from "../../../myTypes";
import SnackBar from "../../../SnackBar";
import Applications from "./Aplications";
import Invitation from "./Invitation";
import Teachers from "./Teachers";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      position: "relative",
    },
  })
);
export function Index() {
  const [open, setOpen] = React.useState(false);
  const { url } = useRouteMatch();
  const history = useHistory();
  const classes = useStyles();
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Button onClick={() => setOpen(true)}>Davet Gönder</Button>
      <Button onClick={() => history.push(pather.join(url, "applications"))}>
        Başvurular
      </Button>
      {open && (
        <Invitation setOpen={() => setOpen(false)} setPr={setSnackBarProp} />
      )}
      <Teachers />
      {snackBarProp.open && (
        <SnackBar pr={snackBarProp} setPr={setSnackBarProp} />
      )}
    </Container>
  );
}

export default function TeacherRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <Index />
      </Route>
      <Route path={pather.join(path, "applications")}>
        <Applications />
      </Route>
      <Redirect to={path} />
    </Switch>
  );
}
