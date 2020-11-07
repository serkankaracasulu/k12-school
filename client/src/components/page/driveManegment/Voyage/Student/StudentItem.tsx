import * as React from "react";

import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { StudentsDriverQuery } from "../../../../../generated/graphql";
import StudentAvatar from "../../../dashboard/StudentAvatar";

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
  })
);
type PropsType = {
  student: StudentsDriverQuery["studentsDriver"][0];
  institutionId: string;
  handleClick: () => void;
};

export default function StudentItem(props: PropsType) {
  const { student, handleClick, institutionId } = props;
  const classes = useStyles();
  return (
    <ListItem className={classes.listItem}>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className={classes.menu}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <ListItemAvatar>
        <ListItemAvatar>
          <StudentAvatar studentId={student._id} instId={institutionId} />
        </ListItemAvatar>
      </ListItemAvatar>
      <ListItemText
        primary={student.fullName}
        secondary={student.citizenshipId}
      />
    </ListItem>
  );
}
