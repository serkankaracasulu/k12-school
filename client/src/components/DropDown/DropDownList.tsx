import clsx from "clsx";
import * as React from "react";

import { Divider, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      backgroundColor: "white",
      margin: 0,
      padding: 0,
      top: "45px",
      right: "0px",
      overflow: "auto",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: theme.palette.grey[200],

      [theme.breakpoints.down("sm")]: {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: theme.mixins.toolbar.minHeight,
        top: theme.mixins.toolbar.minHeight,
        zIndex: theme.zIndex.drawer + 1,
      },
    },
    list: {
      listStyleType: "none",
      maxHeight: "350px",
      overflow: "auto",
      padding: 0,
      margin: 0,
      [theme.breakpoints.down("sm")]: {
        maxHeight: "100%",
      },
    },
    title: {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
      flexGrow: 1,
    },
  })
);
type PropsType = {
  children?: React.ReactNode | React.ReactNodeArray;
  className?: string;
  title: string;
  onBottom?(): void;
};
export default function DropDownList(props: PropsType) {
  const classes = useStyles();
  const { children, className, title, onBottom } = props;
  const handleScrool = (e: React.UIEvent<HTMLUListElement>) => {
    if (
      onBottom &&
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
        e.currentTarget.clientHeight
    ) {
      onBottom();
    }
  };
  return (
    <div className={clsx(classes.root, className)}>
      <ul className={classes.list} onScroll={handleScrool}>
        <li>
          <Typography color="textSecondary" className={classes.title}>
            <b>{title}</b>
          </Typography>
        </li>
        <Divider component="li" />
        {children}
      </ul>
    </div>
  );
}
DropDownList.defaultProps = {
  children: <div />,
  className: "",
};
