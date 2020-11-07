import clsx from "clsx";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Link } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    li: {
      padding: theme.spacing(1, 2),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      minWidth: "200px",
      color: "initial",
    },
    button: {
      width: "100%",
      display: "inline-block",
      cursor: "pointer",
    },
  })
);
type PropsType = {
  children?: React.ReactNode | React.ReactNodeArray;
  className?: string;
  button?: boolean;
  onClick?(): void;
  to?: string;
};

export default function DropDownItem(props: PropsType) {
  const classes = useStyles();
  const { children, className, onClick, button, to } = props;
  const handleClick = () => {
    onClick && onClick();
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 13) {
      handleClick();
    }
  };
  return (
    <li className={clsx(className, classes.li)}>
      {button ? (
        <div
          className={classes.button}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {children}
        </div>
      ) : (
        <>
          {to ? (
            <Link to={to} className={classes.button} component={RouterLink}>
              {children}
            </Link>
          ) : (
            children
          )}
        </>
      )}
    </li>
  );
}
DropDownItem.defaultProps = {
  children: <div />,
  className: "",
  button: false,
};
