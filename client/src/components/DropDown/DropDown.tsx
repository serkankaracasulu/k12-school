import clsx from "clsx";
import * as React from "react";

import { ClickAwayListener, useMediaQuery } from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import ArrowIcon from "@material-ui/icons/ArrowDropUp";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropDown: {
      position: "relative",
      display: "inline-block",
    },
    arrow: {
      position: "absolute",
      top: "26px",
      right: "10px",
      zIndex: theme.zIndex.appBar + 1,
    },
    closeIcon: {
      position: "absolute",
      top: 0,
      right: 0,
      zIndex: theme.zIndex.modal + 1,
    },
  })
);
type PropsType = {
  children?: React.ReactElement;
  className?: string;
  open: boolean;
  onClose(): void;
  button: React.ReactElement;
};
export default function DropDown(props: PropsType) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { children, className, open, onClose, button } = props;
  return (
    <ClickAwayListener onClickAway={open ? onClose : () => {}}>
      <div className={clsx(classes.dropDown, className)}>
        {button}
        {open && (
          <>
            {!fullScreen && (
              <ArrowIcon fontSize="large" className={classes.arrow} />
            )}
            {children}
          </>
        )}
      </div>
    </ClickAwayListener>
  );
}
DropDown.defaultProps = {
  children: <span />,
  className: undefined,
};
