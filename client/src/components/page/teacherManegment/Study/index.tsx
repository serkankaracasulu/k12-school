import * as React from "react";

import { Container } from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import StudiesList from "../../../Study/StudiesList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      position: "relative",
    },
  })
);

export default function StudyMain() {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.container}>
      <StudiesList />
    </Container>
  );
}
