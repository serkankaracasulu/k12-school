import pather from "path";
import * as React from "react";
import {
  Link as RouterLink,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";

import { Container, Link } from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import StuiesList from "../../../Study/StudiesList";
import FindStudy from "./Find";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      position: "relative",
    },
  })
);
export function StudyMain() {
  const { url } = useRouteMatch();
  return (
    <>
      <Link component={RouterLink} to={pather.join(url, "find")}>
        Etüt ara
      </Link>
      <StuiesList />
    </>
  );
}

export default function StudyRoute() {
  const classes = useStyles();
  const { path } = useRouteMatch();
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Switch>
        <Route exact path={path}>
          <StudyMain />
        </Route>
        <Route path={pather.join(path, "find")}>
          <FindStudy />
        </Route>
      </Switch>
    </Container>
  );
}
