import pather from "path";
import * as React from "react";
import { Link as RauterLink } from "react-router-dom";

import {
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Delete as DeleteIcon, MoreVert } from "@material-ui/icons";

import { TeachersQuery, useTeachersQuery } from "../../../../generated/graphql";
import UserProfileAvatar from "../UserAvatar";
import Dismiss from "./Dismiss/Index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    list: {
      display: "flex",
      flexWrap: "wrap",
      "& li": {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
      },
    },
    listItem: {
      border: "1px solid rgba(224, 224, 224, 1)",
      borderRadius: "4px",
      width: "300px",
      height: "90px",
      padding: theme.spacing(2),
    },
    subHeader: {
      width: "100%!important",
    },
    avatar: {
      borderRadius: "4px",
    },
  })
);

export default function TeachersList() {
  const classes = useStyles();
  const { data } = useTeachersQuery();
  const [teacher, setTeacher] = React.useState<TeachersQuery["teachers"][0]>();
  const [openDismiss, setOpenDismiss] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (selectedTeacher: TeachersQuery["teachers"][0]) => (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
    setTeacher(selectedTeacher);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenDismiss(false);
  };
  const handleOpen = () => {
    setOpenDismiss(true);
    setAnchorEl(null);
  };
  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {data &&
          data.teachers.map((teacher) => (
            <ListItem key={teacher._id} className={classes.listItem}>
              <ListItemAvatar>
                <UserProfileAvatar personId={teacher._id} size="small" />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link
                    component={RauterLink}
                    to={pather.join("user", teacher._id)}
                  >
                    {teacher.fullName}{" "}
                  </Link>
                }
                secondary={teacher.educations
                  .map((ed) => ed.department && ed.department.name)
                  .join(", ")}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={handleClick(teacher)}>
                  <MoreVert />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpen}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText>Kurumdan çıkart</ListItemText>
        </MenuItem>
      </Menu>
      {teacher && openDismiss && (
        <Dismiss teacher={teacher} setOpen={handleClose} />
      )}
    </div>
  );
}
