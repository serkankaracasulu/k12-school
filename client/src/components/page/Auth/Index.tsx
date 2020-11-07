import * as React from "react";

import { Avatar, Box, Container, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import Copyright from "../../Copyright";
import LinkHome from "../LinkHome";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "@global": {
      body: {
        backgroundColor: theme.palette.common.white,
      },
    },
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
  })
);
type PropsType = {
  title: string;
  children: React.DetailedHTMLProps<any, HTMLFormElement>;
};
export default function Index(props: PropsType) {
  const classes = useStyles();
  const { title, children } = props;
  return (
    <Container component="main" maxWidth="xs">
      <LinkHome />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
        {children}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
