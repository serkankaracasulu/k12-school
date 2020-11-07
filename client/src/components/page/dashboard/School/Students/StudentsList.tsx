import * as React from "react";

import {
  List,
  ListItem,
  ListSubheader,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

import { StudentFragment } from "../../../../../generated/graphql";
import StudentItem from "../../ListStudentItem";
import StudentDismiss from "../Classes/Students/Dismiss";

type PropsType = {
  students: StudentFragment[];
  classId?: string;
  schoolId?: string;
  title?: string;
  refetch(): Promise<any>;
};
const useStyles = makeStyles((theme: Theme) => ({
  list: {
    display: "flex",
    flexWrap: "wrap",
    "& li": {
      margin: theme.spacing(1),
    },
  },
  listItem: {
    border: "1px solid rgba(224, 224, 224, 1)",
    borderRadius: "4px",
    width: "265px",
    height: "80px",
    padding: theme.spacing(2),
  },
  listItemAdd: {
    padding: theme.spacing(1),
  },
  subHeader: {
    width: "100%!important",
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
}));

export default function StudentListItem(props: PropsType) {
  const classes = useStyles();
  const { students, classId, schoolId, title, refetch } = props;
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const [studentDiss, setStudentDiss] = React.useState<StudentFragment | false>(
    false
  );
  const [openDiss, setOpenDiss] = React.useState(false);
  const handleClick = (student: StudentFragment) => (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event && setAnchorEl(event.currentTarget);
    setStudentDiss(student);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDismiss = () => {
    setOpenDiss(true);
    setAnchorEl(null);
  };
  const filtredStudents = students.filter((st) => {
    if (!schoolId) {
      return !st.school && !st.class;
    }
    if (classId) {
      return st.school === schoolId && st.class === classId;
    }
    return st.school === schoolId && !st.class;
  });
  if (filtredStudents.length > 0)
    return (
      <ListItem>
        <List
          className={classes.list}
          subheader={
            <ListSubheader className={classes.subHeader}>{title}</ListSubheader>
          }
        >
          {filtredStudents.map((student) => (
            <StudentItem
              student={student}
              handleClick={handleClick}
              key={student._id}
            />
          ))}
        </List>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleDismiss}> Sınıftan çıkart</MenuItem>
        </Menu>
        {openDiss && studentDiss && (
          <StudentDismiss
            student={studentDiss}
            setOpen={() => setStudentDiss(false)}
            refetch={refetch}
          />
        )}
      </ListItem>
    );
  return <div />;
}
