import pather from "path";
import * as React from "react";
import { Link as RouterLink, useParams } from "react-router-dom";

import {
  IconButton,
  Link,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { MoreVert } from "@material-ui/icons";

import {
  useParentsQuery,
  UserFragment,
} from "../../../../../generated/graphql";
import { ParentType, ParentTypeTr } from "../type";
import RemoveParent from "./Remove";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    item: {
      width: 270,
      borderStyle: "solid",
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "rgba(0, 0, 0, 0.12)",
    },
  })
);

type ParamType = {
  studentId: string;
};

export default function ParentList() {
  const classes = useStyles();
  const { studentId } = useParams<ParamType>();
  const { data: dataParents } = useParentsQuery({ variables: { studentId } });

  const [parent, setParent] = React.useState<UserFragment>();
  const [removeParent, setRemoveParent] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const handleClick = (parentValue: UserFragment) => (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
    setParent(parentValue);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setParent(undefined);
  };
  const handleRemove = () => {
    setRemoveParent(true);
    setAnchorEl(null);
  };
  return (
    <>
      {dataParents && (
        <List className={classes.root}>
          {dataParents.studentParents.map((parentValue) => (
            <ListItem key={parentValue._id} className={classes.item}>
              <ListItemText
                primary={
                  <Link
                    component={RouterLink}
                    to={pather.join("..", "user", parentValue._id)}
                  >
                    {parentValue.fullName}
                  </Link>
                }
                secondary={
                  ParentTypeTr[
                    parentValue.parentStudents.find(
                      (p) => p.studentId === studentId
                    )?.parentType || ParentType.Bos
                  ]
                }
              />
              <ListItemSecondaryAction>
                <IconButton onClick={handleClick(parentValue)}>
                  <MoreVert />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleRemove}>Çıkart</MenuItem>
      </Menu>
      {removeParent && parent && (
        <RemoveParent setOpen={() => setRemoveParent(false)} parent={parent} />
      )}
    </>
  );
}
