import * as React from "react";
import { Link } from "react-router-dom";

import { Box } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  link: {
    margin: theme.spacing(1, 1.5),
    textDecoration: "none",
    fontSize: "1.5rem",
    color: blue["400"],
  },
}));
const LinkHome = () => {
  const classes = useStyles();
  return (
    <Box m={5}>
      <Link className={classes.link} to="/">
        K12
      </Link>
    </Box>
  );
};

export default LinkHome;
