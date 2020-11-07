import { DateTime } from "luxon";
import * as React from "react";

import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Typography,
} from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { PersonAdd } from "@material-ui/icons";
import AlarmIcon from "@material-ui/icons/Alarm";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import {
  Role,
  StudiesDocument,
  StudiesQuery,
  StudiesQueryVariables,
  StudyFragment,
  StudyState,
  StudyStudentStatus,
  useDeleteStudyMutation,
  useJoinStudyMutation,
} from "../../generated/graphql";
import { generateError, generateSuccess } from "../../helper/generateMessage";
import getUserToken from "../../helper/getUserToken";
import { SetSnackBarProp, SnackBarProp, UserToken } from "../myTypes";
import SnackBar from "../SnackBar";
import messageBox from "./messageBox";
import messageBoxDelete from "./messageBoxDelete";
import Students from "./Students";
import StudyRequest from "./StudyRequest";
import { IStudyStudent } from "./type";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: "flex",
      alignItems: "center",
      "& *": {
        marginRight: theme.spacing(1),
      },
      paddingBottom: theme.spacing(1),
    },
    item: {
      marginBottom: theme.spacing(1),
      boxShadow: "none",
    },
    visContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      "& *": {
        marginRight: theme.spacing(1),
      },
    },
    point: {
      "&::after": {
        content: "'•'",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
    pointBefore: {
      "&::before": {
        content: "'•'",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
    button: {
      textTransform: "capitalize",
    },
    buttonContainer: {
      display: "flex",
      flexGrow: 1,
    },
    buttonProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
    buttonProgress1: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
);
type PropsType = {
  study: StudyFragment;
  week?: number;
  skip?: number;
  queryVariables: StudiesQueryVariables;
};
export default function StudyMain(props: PropsType) {
  const { study, week, skip, queryVariables } = props;
  const classes = useStyles();
  const [pr, setPr] = React.useState<SnackBarProp>();
  const [openRequest, setOpenRequest] = React.useState(false);
  const [openStudents, setOpenStudents] = React.useState(false);
  const userToken = getUserToken();
  return (
    <Card key={study._id} className={classes.item} raised={false}>
      <CardHeader
        action={
          userToken && (
            <StudyTopAction
              study={study}
              week={week}
              userToken={userToken}
              skip={skip}
              setPr={setPr}
              queryVariables={queryVariables}
            />
          )
        }
        title={
          <>
            {study.lessonName && (
              <span className={classes.point}>{study.lessonName}</span>
            )}
            <Typography variant="h6" component="span">
              {study.subject}
            </Typography>
          </>
        }
        subheader={
          <div className={classes.header}>
            {study.date && (
              <time dateTime={study.date.toString()}>
                {DateTime.fromISO(study.date.toString())
                  .toUTC()
                  .toLocaleString({
                    weekday: "short",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </time>
            )}
            <AlarmIcon fontSize="small" />
            <Typography variant="caption" component="span">
              {study.duration} {"dakika"}
            </Typography>
            {study.public ? (
              <VisibilityIcon color="disabled" fontSize="small" />
            ) : (
              <VisibilityOffIcon color="disabled" fontSize="small" />
            )}
          </div>
        }
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {study.detail}
        </Typography>
        <div className={classes.visContainer}>
          {userToken && userToken.roles.includes(Role.Teacher) && (
            <div className={classes.buttonContainer}>
              <Button
                color="secondary"
                size="small"
                className={classes.button}
                startIcon={<PersonIcon />}
                onClick={() => setOpenStudents(true)}
              >
                {
                  study.students.filter(
                    (studentValue) =>
                      (studentValue.status === StudyStudentStatus.Accept ||
                        studentValue.status === StudyStudentStatus.NotJoined) &&
                      studentValue.student !== undefined
                  ).length
                }
              </Button>
              <Button
                color={
                  study.students.some((s) => s.state === StudyState.Unread)
                    ? "primary"
                    : "secondary"
                }
                size="small"
                startIcon={<PersonAddIcon />}
                className={classes.button}
                onClick={() => setOpenRequest(true)}
              >
                {
                  study.students.filter(
                    (studentValue) =>
                      studentValue.status === StudyStudentStatus.Student ||
                      studentValue.status === StudyStudentStatus.Teacher
                  ).length
                }
              </Button>
            </div>
          )}
          {userToken && userToken.roles.includes(Role.Student) && (
            <div className={classes.buttonContainer}>
              <PersonIcon color="secondary" />
              <Typography color="secondary" className={classes.button}>
                {
                  study.students.filter(
                    (studentValue) =>
                      studentValue.status === StudyStudentStatus.Accept ||
                      studentValue.status === StudyStudentStatus.NotJoined
                  ).length
                }
              </Typography>
              <Typography
                className={classes.pointBefore}
                color="textSecondary"
                variant="subtitle1"
              >
                Durum :
              </Typography>
              <StudentStatus
                study={study}
                userToken={userToken}
                queryVariables={queryVariables}
              />
            </div>
          )}
          <div>
            <Typography variant="body2" color="textSecondary">
              Kapasite {study.capacity || "(Yok)"}
            </Typography>
          </div>
        </div>
      </CardContent>
      {userToken && (
        <CardActions>
          <StudyBottomAction
            study={study}
            userToken={userToken}
            setPr={setPr}
            queryVariables={queryVariables}
          />
        </CardActions>
      )}
      {openRequest && (
        <StudyRequest
          setOpen={() => setOpenRequest(false)}
          study={study}
          request={study.students.filter(
            (studentValue) =>
              studentValue.status === StudyStudentStatus.Student ||
              studentValue.status === StudyStudentStatus.Teacher
          )}
        />
      )}
      {openStudents && (
        <Students
          setOpen={() => setOpenStudents(false)}
          study={study}
          students={
            study.students.filter(
              (studentValue) =>
                (studentValue.status === StudyStudentStatus.Accept ||
                  studentValue.status === StudyStudentStatus.NotJoined) &&
                studentValue.student !== undefined
            ) as IStudyStudent[]
          }
        />
      )}
      {pr && <SnackBar pr={pr} setPr={setPr} />}
    </Card>
  );
}
interface ActionProp extends PropsType {
  userToken: UserToken;
}
function StudyTopAction(props: ActionProp & { setPr: SetSnackBarProp }) {
  const { study, week, userToken, setPr } = props;
  const classes = useStyles();
  const [qDelete, setqDelete] = React.useState(false);
  const [deleteStudy, { loading, error, data }] = useDeleteStudyMutation({
    onError: () => {},
    onCompleted: () => generateSuccess(setPr, messageBoxDelete),
  });
  const handleDeleteStudy = () => {
    deleteStudy({
      variables: { studyId: study._id },
      update: (proxy, result) => {
        const variables: StudiesQueryVariables = {
          week,
        };
        if (result.data) {
          const studiesQuery = proxy.readQuery<
            StudiesQuery,
            StudiesQueryVariables
          >({
            query: StudiesDocument,
            variables,
          });
          const week = Math.round(
            DateTime.fromISO(study.date).diffNow("weeks").as("week")
          );

          if (studiesQuery) {
            const { studies } = studiesQuery;
            const editStudies = studies.filter(
              (studyValue) => studyValue._id !== result.data?.deleteStudy._id
            );
            try {
              proxy.writeQuery<StudiesQuery, StudiesQueryVariables>({
                query: StudiesDocument,
                data: { studies: editStudies },
                variables: { week },
              });
              proxy.writeQuery<StudiesQuery, StudiesQueryVariables>({
                query: StudiesDocument,
                data: { studies: editStudies },
                variables,
              });
            } catch (error) {
              //
            }
          }
        }
      },
    });
  };
  if (userToken?.roles.includes(Role.Teacher)) {
    if (qDelete)
      return (
        <ButtonGroup size="small">
          <Button onClick={() => setqDelete(false)}>
            <ClearIcon />
          </Button>
          <Button
            variant={data ? "contained" : "outlined"}
            disabled={loading}
            onClick={handleDeleteStudy}
            color={(data && "primary") || (error && "secondary") || "default"}
          >
            <DoneIcon />
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </Button>
        </ButtonGroup>
      );
    else
      return (
        <IconButton aria-label="delete" onClick={() => setqDelete(true)}>
          <DeleteIcon />
        </IconButton>
      );
  }
  return <span />;
}
function StudyBottomAction(props: ActionProp & { setPr: SetSnackBarProp }) {
  const { study, userToken, setPr, queryVariables } = props;
  const classes = useStyles();
  const [joinStudy, { loading }] = useJoinStudyMutation({
    onError: (tError) => {
      generateError(tError, setPr, messageBox);
    },
  });
  const handleJoinStudy = (r?: boolean) => {
    joinStudy({
      variables: { studyId: study._id, r },
      update: (proxy, result) => {
        if (result && result.data?.joinStudy) {
          const { joinStudy } = result.data;
          const studiesResult = proxy.readQuery<
            StudiesQuery,
            StudiesQueryVariables
          >({
            query: StudiesDocument,
            variables: queryVariables,
          });
          if (studiesResult) {
            const { studies } = studiesResult;
            const editStudies = studies.map((studyValue) => {
              if (studyValue._id === joinStudy._id) return joinStudy;
              return studyValue;
            });
            proxy.writeQuery<StudiesQuery, StudiesQueryVariables>({
              query: StudiesDocument,
              data: {
                studies: editStudies,
              },
              variables: queryVariables,
            });
            if (!r) {
              const studiesQeury = proxy.readQuery<
                StudiesQuery,
                StudiesQueryVariables
              >({
                query: StudiesDocument,
              });
              if (studiesQeury) {
                proxy.writeQuery<StudiesQuery, StudiesQueryVariables>({
                  query: StudiesDocument,
                  data: {
                    studies: [joinStudy, ...studiesQeury?.studies],
                  },
                });
              }
            }
          }
        }
      },
    });
  };
  const isJoined = study.students.some((s) => s.studentId === userToken._id);
  if (userToken.roles.includes(Role.Student))
    if (!isJoined)
      return (
        <Button
          onClick={() => handleJoinStudy()}
          color="primary"
          disabled={loading}
          startIcon={
            <>
              <PersonAdd />
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </>
          }
        >
          KATIL
        </Button>
      );
    else
      return (
        <Button
          onClick={() => handleJoinStudy(true)}
          color="secondary"
          disabled={loading}
          startIcon={
            <>
              <PersonAddDisabledIcon />
              {loading && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </>
          }
        >
          AYRIL
        </Button>
      );
  return <></>;
}
function StudentStatus(props: ActionProp) {
  const { userToken, study } = props;
  const studyStudent = study.students.find(
    (value) => value.studentId === userToken._id
  );
  let status = "";
  switch (studyStudent?.status) {
    case StudyStudentStatus.Accept:
      status = "Katıldın";
      break;
    case StudyStudentStatus.Student:
      status = "İstek gönderildi";
      break;
    case StudyStudentStatus.Teacher:
      status = "Öğretmen istek gönderdi";
      break;
    case StudyStudentStatus.NotJoined:
      status = "Katıldın ama gitmedin";
      break;
    default:
      status = "";
      break;
  }
  return (
    <Typography color="primary" variant="subtitle1">
      {status}
    </Typography>
  );
}
