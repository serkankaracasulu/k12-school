import * as React from "react";

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  useStudentsQuery,
  MyLessonsQuery,
} from "../../../../../generated/graphql";
import DialogWrapper from "../../../../DialogW";
import SendMessageButton from "../../../../SendMessageButton";
import StudentAvatar from "../../../dashboard/StudentAvatar";

type PropsType = {
  setOpen(): void;
  schoolId: string;
  classData: MyLessonsQuery["schools"][0]["classes"][0];
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    rightButton: {
      marginLeft: theme.spacing(1),
    },
  })
);

export default function (props: PropsType) {
  const { setOpen, schoolId, classData } = props;
  const { data, loading } = useStudentsQuery({
    variables: { schoolId, classId: classData._id },
  });
  const classes = useStyles();
  const className = `${classData.level} ${classData.code || ""} ${
    classData.code1 || ""
  } ${classData.name || ""}`;
  return (
    <DialogWrapper
      title={className}
      setOpen={setOpen}
      loading={loading}
      maxWidth={false}
    >
      <List dense className={classes.root}>
        {data &&
          data.students.map((student) => (
            <ListItem key={student._id} button>
              <ListItemAvatar>
                <ListItemAvatar>
                  <StudentAvatar studentId={student._id} size="small" />
                </ListItemAvatar>
              </ListItemAvatar>
              <ListItemText primary={student.fullName} />
              <ListItemSecondaryAction>
                <SendMessageButton to={student._id} />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    </DialogWrapper>
  );
}
