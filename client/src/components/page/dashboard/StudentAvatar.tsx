import clsx from "clsx";
import * as querystring from "querystring";
import * as React from "react";

import { Avatar } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatarMedium: {
      width: "60px",
      height: "60px",
      marginRight: theme.spacing(1),
    },
    avatarSmall: {
      width: "42px",
      height: "42px",
      marginRight: theme.spacing(1),
    },
    center: {
      marginRight: "auto",
      marginLeft: "auto",
    },
    avatarLarge: {
      width: "150px",
      height: "150px",
    },
  })
);

type PropsType = {
  studentId: string;
  size?: "inherit" | "default" | "large" | "small" | undefined;
  instId?: string;
  center?: boolean;
};

export default function StudentAvatar(props: PropsType) {
  const classes = useStyles();
  const t = localStorage.getItem("token");
  const { studentId, size, instId, center } = props;
  return (
    <Avatar
      className={clsx(getSize(), center && classes.center)}
      src={`/students/profile?${querystring.stringify({
        i: studentId,
        t,
        instId: instId || "",
      })}`}
    ></Avatar>
  );
  function getSize(): string | undefined {
    switch (size) {
      case "small":
        return classes.avatarSmall;
      case "default":
        return classes.avatarMedium;
      case "large":
        return classes.avatarLarge;
      default:
        return classes.avatarMedium;
    }
  }
}
