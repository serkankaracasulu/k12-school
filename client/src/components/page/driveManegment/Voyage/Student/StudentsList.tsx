import * as React from "react";

import { List, Menu, MenuItem } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  RemoveStudentVoyageMutationVariables,
  StudentsDriverQuery,
  useStudentsDriverQuery,
} from "../../../../../generated/graphql";
import RemoveStudent from "./RemoveStudent";
import StudentItem from "./StudentItem";

type PropsType = {
  studentIds: string[];
  institutionId: string;
  voyageId: string;
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: "100%",
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
      display: "flex",
      width: "100%",
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
    input: {
      marginLeft: theme.spacing(2),
    },
    iconButton: {
      padding: 10,
    },
  })
);

export default function StudentList({
  studentIds,
  institutionId,
  voyageId,
}: PropsType) {
  const [student, setStudent] = React.useState<
    StudentsDriverQuery["studentsDriver"][0]
  >();
  const [openRemove, setOpenRemove] = React.useState<
    RemoveStudentVoyageMutationVariables
  >();
  const classes = useStyles();
  const { data } = useStudentsDriverQuery({
    variables: { studentIds, institutionId, search: "" },
  });

  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const handleClick = (
    studentItem: StudentsDriverQuery["studentsDriver"][0]
  ) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
    setStudent(studentItem);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpenDelete = () => {
    student && setOpenRemove({ voyageId, studentId: student._id });
  };

  return (
    <div>
      <List className={classes.list}>
        {data &&
          data.studentsDriver.map((studentItem) => (
            <StudentItem
              student={studentItem}
              handleClick={() => handleClick(studentItem)}
              key={studentItem._id}
              institutionId={institutionId}
            />
          ))}
      </List>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenDelete}>Bu servisten çıkar</MenuItem>
      </Menu>
      {openRemove && (
        <RemoveStudent
          setOpen={() => {
            handleClose();
            setOpenRemove(undefined);
          }}
          variables={openRemove}
        />
      )}
    </div>
  );
}
