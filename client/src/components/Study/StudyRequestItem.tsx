import clsx from "clsx";
import * as React from "react";

import {
  Button,
  ButtonGroup,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/Check";

import { StudyState, useUpdateStudyMutation } from "../../generated/graphql";
import StudentAvatar from "../page/dashboard/StudentAvatar";
import { IStudyStudent } from "./type";
import useAcceptDecline from "./useAcceptDecline";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexWrap: "wrap",
    },
    action: {
      [theme.breakpoints.down("sm")]: {
        paddingTop: theme.spacing(1),
      },
    },
    buttonProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
    color: {
      backgroundColor: lightBlue["50"],
    },
  })
);

type PropsType = {
  studyStudent: IStudyStudent;
  studyId: string;
};

export default function StudyRequest(props: PropsType) {
  const { studyStudent, studyId } = props;
  const [update] = useUpdateStudyMutation({ onError: () => {} });
  const classes = useStyles();
  const [mutate, { loading }] = useAcceptDecline();
  React.useEffect(() => {
    return function cleanup() {
      if (studyStudent.state === StudyState.Unread)
        update({
          variables: { studyStudentId: studyStudent._id, studyId },
        });
    };
  }, [studyId, studyStudent._id, update, studyStudent.state]);
  return (
    <ListItem
      className={clsx(
        classes.root,
        studyStudent.state !== StudyState.Read ? classes.color : undefined
      )}
    >
      <ListItemAvatar>
        <StudentAvatar studentId={studyStudent.student._id} />
      </ListItemAvatar>
      <ListItemText primary={studyStudent.student.fullName} />
      <ButtonGroup className={classes.action}>
        <Button
          color="secondary"
          endIcon={<CancelIcon />}
          onClick={() =>
            mutate({ studyId, studentId: studyStudent.studentId, r: true })
          }
        >
          YOKSAY
        </Button>
        <Button
          color="primary"
          startIcon={<CheckIcon />}
          disabled={loading}
          onClick={() => mutate({ studyId, studentId: studyStudent.studentId })}
        >
          KABUL ET
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Button>
      </ButtonGroup>
    </ListItem>
  );
}
