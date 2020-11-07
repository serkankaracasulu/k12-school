import pather from "path";
import * as React from "react";
import { Link as RouterLink, useRouteMatch } from "react-router-dom";

import {
  IconButton,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { StudentQuery } from "../../../generated/graphql";
import SendMessageButton from "../../SendMessageButton";
import StudentAvatar from "./StudentAvatar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      border: "1px solid rgba(224, 224, 224, 1)",
      borderRadius: "4px",
      width: "265px",
      height: "80px",
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
    },
    avatar: {
      width: "60px",
      height: "60px",
      marginRight: theme.spacing(1),
    },
    menu: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    bottomButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
    },
  })
);
type PropsType = {
  student: StudentQuery["student"];
  handleClick: (
    student: StudentQuery["student"]
  ) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function StudentItem(props: PropsType) {
  const { student, handleClick } = props;
  const { url } = useRouteMatch();
  const classes = useStyles();
  const mainurl = url.split("/")[1];
  return (
    <ListItem className={classes.listItem}>
      <ListItemAvatar>
        <ListItemAvatar>
          <StudentAvatar studentId={student._id} />
        </ListItemAvatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Link
            component={RouterLink}
            to={pather.join("/", mainurl, "student", student._id)}
          >
            {student.fullName}
          </Link>
        }
        secondary={student.citizenshipId}
      />
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick(student)}
        className={classes.menu}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <div className={classes.bottomButton}>
        <SendMessageButton to={student._id} />
      </div>
    </ListItem>
  );
}
