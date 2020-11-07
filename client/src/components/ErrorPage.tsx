import * as React from "react";

import { Paper, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import MainAppBar from "./page/pricing/MainAppBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      flex: "1",
      minHeight: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
  })
);
export default function ErrorPage() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <MainAppBar></MainAppBar>
      <Paper className={classes.paper} elevation={0}>
        <Typography variant="h1" color="error">
          ERROR
        </Typography>
      </Paper>
    </React.Fragment>
  );
}
