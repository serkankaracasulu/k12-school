import pather from "path";
import * as React from "react";
import {
  Link as RouterLink,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";

import { LinearProgress, Link } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { useVoyagesQuery } from "../../../../generated/graphql";
import ErrorPage from "../../../ErrorPage";
import VoyageCreate from "./Create/Index";
import VoyagePage from "./Voyage/Index";
import VoyageCardItem from "./VoyageItem/Index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(3, 1, 3, 1),
      position: "relative",
    },
    list: {
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);

export function VoyagesPage() {
  const classes = useStyles();
  const { url } = useRouteMatch();
  const { data, loading, error } = useVoyagesQuery({
    onError: () => {},
  });
  if (loading) return <LinearProgress />;
  if (error) return <ErrorPage />;
  return (
    <div>
      <Link component={RouterLink} to={pather.join(url, "create")}>
        Yeni sefer oluştur
      </Link>
      <div className={classes.list}>
        {data &&
          data.voyages.map((voyage) => (
            <VoyageCardItem key={voyage._id} voyage={voyage} />
          ))}
      </div>
    </div>
  );
}

export default function VoyageRouter() {
  const classes = useStyles();
  const { path } = useRouteMatch();
  return (
    <div className={classes.container}>
      <Switch>
        <Route exact path={path}>
          <VoyagesPage />
        </Route>
        <Route exact path={pather.join(path, "create")}>
          <VoyageCreate />
        </Route>
        <Route path={pather.join(path, ":voyageId")}>
          <VoyagePage />
        </Route>
      </Switch>
    </div>
  );
}
