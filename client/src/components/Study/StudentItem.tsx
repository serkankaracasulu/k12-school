import * as React from "react";

import {
  Button,
  ButtonGroup,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/Check";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

import { StudyStudentStatus } from "../../generated/graphql";
import { AcceptJoinStudyTvariables } from "../myTypes";
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
  })
);

type PropsType = {
  studyStudent: IStudyStudent;
  studyId: string;
};

export default function StudentItem(props: PropsType) {
  const { studyStudent, studyId } = props;
  const [mutate, { loading }] = useAcceptDecline();
  const [actionCancel, setActionCancel] = React.useState(false);
  const [actionNotJoined, setActionNotJoined] = React.useState(false);
  const [actionJoined, setActionJoined] = React.useState(false);
  const classes = useStyles();
  function handleMutate() {
    let status: AcceptJoinStudyTvariables["status"] = undefined;
    if (actionNotJoined) status = StudyStudentStatus.NotJoined as any;
    else if (actionJoined) status = StudyStudentStatus.Accept as any;
    mutate({
      studyId,
      studentId: studyStudent.studentId,
      r: actionCancel,
      status: status as any,
    });
    handleCancel();
  }
  function handleCancel() {
    actionCancel && setActionCancel(false);
    actionNotJoined && setActionNotJoined(false);
    actionJoined && setActionJoined(false);
  }
  return (
    <ListItem className={classes.root}>
      <ListItemAvatar>
        <StudentAvatar studentId={studyStudent.student._id} />
      </ListItemAvatar>
      <ListItemText primary={studyStudent.student.fullName} />
      {!actionCancel && !actionNotJoined && !actionJoined ? (
        <ButtonGroup className={classes.action}>
          <Button
            onClick={() => setActionCancel(true)}
            endIcon={<CancelIcon />}
            disabled={loading}
          >
            GELEMİYECEK
          </Button>
          {studyStudent.status === StudyStudentStatus.Accept ? (
            <Button
              color="secondary"
              onClick={() => setActionNotJoined(true)}
              startIcon={<ThumbDownIcon />}
              disabled={loading}
            >
              KATILMADI
            </Button>
          ) : (
            <Button
              color="primary"
              onClick={() => setActionJoined(true)}
              startIcon={<ThumbUpIcon />}
              disabled={loading}
            >
              KATILDI
            </Button>
          )}
          :
        </ButtonGroup>
      ) : (
        <ButtonGroup className={classes.action}>
          <Button onClick={handleCancel} endIcon={<CancelIcon />}>
            Hayır
          </Button>
          <Button
            startIcon={<CheckIcon />}
            onClick={handleMutate}
            color="secondary"
          >
            Evet
          </Button>
        </ButtonGroup>
      )}
    </ListItem>
  );
}
