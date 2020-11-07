import clsx from "clsx";
import * as React from "react";

import { Button, ButtonProps } from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import { makeStyles } from "@material-ui/core/styles";

type PropsType = {
  danger?: boolean;
} & ButtonProps;

const useStyles = makeStyles((theme) => ({
  eventItem: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    minWidth: theme.spacing(2),
    boxShadow: "none",
    "&:hover": {
      boxShadow: "none",
    },
    padding: 0,
    "& span": {
      textTransform: "none",
      whiteSpace: "nowrap",
      overflow: "hidden",
      paddingLeft: theme.spacing(1),
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    "&::before": {
      content: "''",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    },
    "&::after": {
      content: "''",
      position: "absolute",
      top: "-1px",
      left: "-1px",
      width: "105%",
      height: "105%",
      pointerEvents: "none",
    },
    border: "1px solid rgba(224, 224, 224, 1)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgb(224, 224, 224)",
  },
  danger: {
    backgroundColor: red["400"],
  },
}));
// eslint-disable-next-line react/prop-types
const EventItem: React.FC<PropsType> = ({ children, ...rest }) => {
  const { danger, ...others } = rest;
  const classes = useStyles();
  return (
    <Button
      color="primary"
      variant="contained"
      className={clsx(classes.eventItem, danger ? classes.danger : "")}
      {...others}
    >
      {children}
    </Button>
  );
};
export default EventItem;
