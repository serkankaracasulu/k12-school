import * as React from "react";
import { LinkProps as RouterLinkProps, NavLink } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText, {
  ListItemTextProps,
} from "@material-ui/core/ListItemText";

type PropsType = {
  icon: React.ReactElement;
  primary: string;
  secondary?: ListItemTextProps<"span", "p">["secondary"];
  to: string;
  handleSelect(to: string): void;
  selectedPage: string;
  className?: string;
};
export default function ListItemLink(props: PropsType) {
  const {
    icon,
    primary,
    to,
    handleSelect,
    selectedPage,
    secondary,
    className,
  } = props;

  const likRef = React.forwardRef<any, Omit<RouterLinkProps, "to">>(
    (itemProps, ref) => <NavLink to={to} {...itemProps} innerRef={ref} />
  );
  const name = likRef.displayName || likRef.name;
  likRef.displayName = `logProps(${name})`;
  const renderLink = React.useMemo(() => likRef, [likRef]);

  return (
    <ListItem
      button
      className={className}
      component={renderLink}
      onClick={() => handleSelect(to)}
      selected={to === selectedPage}
    >
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  );
}
