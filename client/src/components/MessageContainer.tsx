import * as React from "react";

import { Container, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));
type Props = {
  message: string;
};

export default function MessageBox(props: Props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Container component="main" maxWidth="sm">
        <Paper className={classes.paper} elevation={1}>
          <Typography variant="body1" component="h3">
            {props.message}
          </Typography>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
