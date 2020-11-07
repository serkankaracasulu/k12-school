import * as React from "react";

import { Container, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ErrorIcon from "@material-ui/icons/Error";

import Copyright from "./Copyright";
import MainAppBar from "./page/pricing/MainAppBar";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 2),
  },
  paper: {
    marginTop: theme.spacing(8),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
  },
  Typography: {
    paddingTop: "1rem",
  },
}));

export default function MessageBox({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <MainAppBar />
      <Container component="main" maxWidth="xs" className={classes.root}>
        <Paper className={classes.paper} elevation={1}>
          {title === "error" ? (
            <ErrorIcon />
          ) : (
            title && (
              <Typography
                variant="body1"
                component="h2"
                className={classes.Typography}
              >
                {title}
              </Typography>
            )
          )}
          {message && (
            <Typography
              variant="body1"
              component="h3"
              className={classes.Typography}
            >
              {message}
            </Typography>
          )}
        </Paper>
      </Container>
      <Copyright />
    </React.Fragment>
  );
}
