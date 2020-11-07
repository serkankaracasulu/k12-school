import { DateTime } from "luxon";
import * as React from "react";

import {
  Avatar,
  Button,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";

import {
  AbsenceFragment,
  LessonFragment,
  useAbsencesQuery,
  useMyLessonsQuery,
  WeeklyScheduleFragment,
} from "../../../../generated/graphql";
import { EventItemDetail } from "../../../myTypes";
import LessonDetail from "../Schedule/Detail";
import { ScheduleItemType } from "../Schedule/flow";
import AddAbsence from "./Add";
import AbsenceDetail from "./Detail";
import { LessonAddPropsType } from "./type";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      [theme.breakpoints.down("sm")]: {
        padding: 0,
      },
    },
  })
);
interface Lw {
  lw: WeeklyScheduleFragment;
  schoolId: string;
  classId: string;
  detail: ScheduleItemType;
}
interface LessonAndSchedule extends LessonFragment, Lw {}
export default function AbsencePage() {
  const classes = useStyles();
  const [lessons, setLessons] = React.useState<LessonAndSchedule[]>([]);
  const { data } = useAbsencesQuery();
  const [openAbsenceDetail, setOpenAbsenceDetail] = React.useState<{
    absences: AbsenceFragment[];
    schoolId: string;
    classId: string;
  } | void>();
  const [openDetail, setOpenDetail] = React.useState<EventItemDetail>();
  const [addVariables, setAddVariables] = React.useState<Omit<
    LessonAddPropsType,
    "setOpen"
  > | void>();
  useMyLessonsQuery({
    onCompleted: (tData) => {
      const now = DateTime.local();
      const weekday = now.weekday - 1;

      const lessonArray: LessonAndSchedule[] = [];
      for (const school of tData.schools) {
        for (const classValue of school.classes) {
          if (classValue.lessons)
            for (const lesson of classValue.lessons) {
              for (const lw of lesson.lessonWeeklySchedules) {
                const hour = school.weeklyHour?.hour.find(
                  (hourValue) => hourValue.code === lw.hourCode
                );

                if (lw.day === weekday && hour) {
                  lessonArray[lw.hourCode] = {
                    ...lesson,
                    lw,
                    schoolId: school._id,
                    classId: classValue._id,
                    detail: {
                      schoolName: school.name,
                      lessonName: lesson.name || lesson.lessonName || "",
                      _id: lw._id,
                      day: lw.hourCode,
                      courseId: lesson._id,
                      schoolClass: classValue,
                      hour,
                      height: 0,
                      top: 0,
                      startDate: DateTime.local(),
                      endDate: DateTime.local(),
                    },
                  };
                }
              }
            }
        }
      }
      setLessons(lessonArray.filter((l) => l !== undefined));
    },
  });
  function AbsenceCount(props: { value: LessonAndSchedule }) {
    const { value } = props;
    if (data) {
      const absences = data.absences.filter(
        (absenceValue) =>
          absenceValue.lessonId === value._id &&
          absenceValue.hourCode === value.lw.hourCode
      );
      return (
        <TableCell>
          <IconButton
            onClick={() =>
              setOpenAbsenceDetail({
                absences,
                schoolId: value.schoolId,
                classId: value.classId,
              })
            }
          >
            <Avatar>{absences.length}</Avatar>
          </IconButton>
        </TableCell>
      );
    }
    return <TableCell />;
  }
  const handleOpen = (variable: LessonAndSchedule) => {
    const { lw, detail, schoolId, classId, ...rest } = variable;
    if (data) {
      const absences = data.absences.filter(
        (absenceValue) =>
          absenceValue.lessonId === rest._id &&
          absenceValue.hourCode === lw.hourCode
      );
      setAddVariables({
        schoolId,
        classId,
        lesson: rest,
        hourCode: lw.hourCode,
        existStudentIds: absences.map((v) => v.studentId),
      });
    }
  };
  return (
    <Container maxWidth="md" className={classes.root}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ders</TableCell>
            <TableCell align="left">Saat</TableCell>
            <TableCell align="left">Ekle</TableCell>
            <TableCell align="left">Yok Yazılan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lessons.map((lessonValue) => (
            <TableRow key={lessonValue.lw._id}>
              <TableCell component="th" scope="row">
                <Button style={{ textTransform: "inherit" }}>
                  {lessonValue.detail.lessonName}
                </Button>
              </TableCell>
              <TableCell component="th" scope="row">
                {lessonValue.lw.hourCode}
              </TableCell>
              <TableCell component="th" scope="row">
                <IconButton
                  color="primary"
                  onClick={() => handleOpen(lessonValue)}
                >
                  <PersonAddDisabledIcon />
                </IconButton>
              </TableCell>
              <AbsenceCount value={lessonValue} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {openDetail && (
        <LessonDetail
          values={openDetail}
          setOpen={() => setOpenDetail(undefined)}
        />
      )}
      {addVariables && (
        <AddAbsence {...addVariables} setOpen={() => setAddVariables()} />
      )}
      {openAbsenceDetail && (
        <AbsenceDetail
          classId={openAbsenceDetail.classId}
          schoolId={openAbsenceDetail.schoolId}
          absences={openAbsenceDetail.absences}
          setOpen={() => setOpenAbsenceDetail()}
        />
      )}
    </Container>
  );
}
