import * as React from "react";
import { Avatar } from "@material-ui/core";
import * as querystring from "querystring";
import UserIcon from "@material-ui/icons/Person";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import getUserToken from "../../../helper/getUserToken";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatarLarge: {
      width: "150px",
      height: "150px",
    },
    avatarMedium: {
      width: "60px",
      height: "60px",
    },
    avatarSmall: {
      width: "42px",
      height: "42px",
    },
    avatarXsmall: {
      width: "24px",
      height: "24px",
    },
    center: {
      marginRight: "auto",
      marginLeft: "auto",
    },
  })
);

type PropsType = {
  personId?: string | null;
  size?: "small" | "inherit" | "large" | "default" | undefined;
  center?: boolean;
  onClick?(): any;
};

export default function UserProfileAvatar(props: PropsType) {
  const classes = useStyles();
  const user = getUserToken();
  const { size, onClick, personId, center } = props;
  if (user)
    return (
      <Avatar
        onClick={onClick}
        className={clsx(getSize(), center && classes.center)}
        src={`/users/profile?${querystring.stringify({
          i: personId || user._id,
          t: localStorage.getItem("token"),
        })}`}
      >
        <UserIcon fontSize={size} />
      </Avatar>
    );
  return (
    <Avatar className={getSize()}>
      <UserIcon />
    </Avatar>
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
