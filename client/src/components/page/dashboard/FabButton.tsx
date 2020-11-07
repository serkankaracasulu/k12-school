import * as React from "react";

import { Fab, useTheme, Zoom } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Add, SchoolSharp } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    zIndex: theme.zIndex.drawer + 1,
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function FabButton() {
  const theme = useTheme();
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  const classes = useStyles();
  return (
    <Zoom in timeout={transitionDuration}>
      <Fab
        variant="extended"
        aria-label="add"
        className={classes.fab}
        color="primary"
      >
        <Add className={classes.extendedIcon} fontSize="large" />
        <SchoolSharp />
      </Fab>
    </Zoom>
  );
}
