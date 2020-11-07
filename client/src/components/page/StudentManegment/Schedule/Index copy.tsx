import clsx from "clsx";
import { DateTime } from "luxon";
import * as React from "react";

import {
  Avatar,
  Box,
  Button,
  Grid,
  Grow,
  LinearProgress,
  Paper,
  Typography,
} from "@material-ui/core/";
import { red } from "@material-ui/core/colors";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import AbsenceIcon from "@material-ui/icons/PersonAddDisabled";

import {
  StudyFragment,
  useAbsencesQuery,
  useMyHourQuery,
  useMyLessonsStudentQuery,
  useStudiesQuery,
} from "../../../../generated/graphql";
import Context from "../../../Context";
import StudyItemContainer from "../../../Study/StudyItemContainer";

const heightNumber = 81;
const height = `${heightNumber}px`;
const dayHeight = "70px";
const hourWidth = "60px";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    background: {
      backgroundColor: theme.palette.primary.main,
      fontSize: "inherit",
    },
    border: {
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: "rgba(0, 0, 0, 0.12)",
    },
    bottomBorder: {
      borderBottomStyle: "solid",
      borderBottomWidth: "1px",
      borderBottomColor: "rgba(0, 0, 0, 0.12)",
    },
    height: {
      height,
    },
    headerheight: {
      height: "40px",
      minHeight: "40px",
    },
    day: {
      position: "sticky",
      top: 0,
      height: dayHeight,
      backgroundColor: theme.palette.background.paper,
      zIndex: theme.zIndex.appBar,
    },
    hours: {
      position: "sticky",
      backgroundColor: "white",
      left: 0,
      flexGrow: 0,
      boxShadow: theme.shadows[1],
      zIndex: 1,
      width: hourWidth,
    },
    rowBorder: {
      height: `calc(${height} + ${dayHeight}) `,
    },
    adth: {
      height,
      "&::after": {
        content: "''",
        borderBottom: "#dadce0 1px solid",
        position: "absolute",
        width: `calc(100% - ${hourWidth})`,
        marginTop: "-1px",
        pointerEvents: "none",
      },
    },
    shadow: {
      boxShadow: theme.shadows[1],
      height: "3px",
      width: "100%",
      position: "absolute",
      bottom: 0,
    },
    flexCenter: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing(1, 0, 1, 0),
      flexDirection: "column",
    },
    container: {
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)",
      justifyItems: "center",
      position: "absolute",
      width: `calc(100% - ${hourWidth})`,
      height: "100%",
      left: hourWidth,
      top: dayHeight,
    },
    hourWidth: {
      width: hourWidth,
    },
    lesson: {
      textTransform: "inherit",
      height: "100%",
      padding: 0,
      overflow: "hidden",
    },
    mainContainer: {
      height: "86vh ",
      maxHeight: "850px",
      position: "relative",
      minWidth: theme.breakpoints.values["sm"],
    },
    lessonContainer: {
      overflow: "hidden",
      padding: theme.spacing(0, 1, 1, 0),
    },
    absenceContainer: {
      justifySelf: "flex-end",
      alignSelf: "start",
      zIndex: 1,
    },
    studyContainer: {
      width: "100%",
    },
  })
);

const StudyButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(red[500]),
    opacity: "0.7",
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
    },
    width: "50%",
    left: "50%",
    height: "100%",
    minWidth: "inherit",
  },
}))(Button);

export default function WeeklySchedule() {
  const { studentIndex } = React.useContext(Context);
  const [openStudy, setOpenStudy] = React.useState<StudyFragment | void>();
  const { data: dataMyHours, loading: loadingHour } = useMyHourQuery({
    variables: { parentStudentId: studentIndex },
  });
  const { data: dataAbsences } = useAbsencesQuery({
    variables: { parentStudentId: studentIndex },
  });
  const { data, loading } = useMyLessonsStudentQuery({
    variables: { parentStudentId: studentIndex },
  });
  const { data: dataStudy } = useStudiesQuery({
    variables: { week: 0 },
  });
  const classes = useStyles();
  const [days] = React.useState<
    {
      day: number;
      shortName: string;
      today: boolean;
    }[]
  >(
    [0, 1, 2, 3, 4, 5, 6].map((_, index) => {
      return {
        day: DateTime.local().startOf("week").plus({ day: index }).day,
        shortName: DateTime.local().startOf("week").plus({ day: index })
          .weekdayShort,
        today:
          DateTime.local().day ===
          DateTime.local().startOf("week").plus({ day: index }).day,
      };
    })
  );

  return (
    <Paper style={{ overflow: "auto" }}>
      {(loading || loadingHour) && <LinearProgress />}
      {dataMyHours && dataMyHours.myHour && (
        <Grid
          container
          direction="row"
          alignItems="stretch"
          className={classes.mainContainer}
        >
          <Grid
            container
            item
            xs
            className={clsx(classes.hours, classes.border)}
            direction="column"
            justify="flex-start"
            style={{
              height: `calc((${height} * ${dataMyHours.myHour.length}) + ${dayHeight})`,
            }}
          >
            <div
              className={clsx(
                classes.bottomBorder,
                classes.day,
                classes.hourWidth
              )}
            >
              <div className={classes.shadow} />
            </div>
            {dataMyHours.myHour.map((hour) => (
              <Box
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                display="flex"
                key={hour.code}
                className={clsx(
                  classes.bottomBorder,
                  classes.height,
                  classes.hourWidth
                )}
              >
                <Typography color="textSecondary" variant="body2">
                  {hour.start}
                </Typography>
                <Typography color="textPrimary" variant="caption">
                  {hour.code}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  {hour.finish}
                </Typography>
              </Box>
            ))}
          </Grid>
          <div>
            <div className={classes.rowBorder} />
            {dataMyHours &&
              dataMyHours.myHour.map((hour) => (
                <div key={hour.code} className={classes.adth} />
              ))}
          </div>
          {days.map((day) => (
            <Grid
              container
              item
              xs
              key={day.day}
              className={classes.border}
              style={{
                height: `calc((${height} * ${dataMyHours.myHour.length}) + ${dayHeight})`,
              }}
            >
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                key={day.day}
                className={clsx(classes.bottomBorder, classes.day)}
              >
                <Typography
                  color="textSecondary"
                  variant="body2"
                  align="center"
                >
                  {day.shortName}
                </Typography>
                {day.today ? (
                  <Avatar className={classes.background}> {day.day}</Avatar>
                ) : (
                  <Typography
                    color="textSecondary"
                    variant="body1"
                    align="center"
                  >
                    {day.day}
                  </Typography>
                )}
                <div className={classes.shadow} />
              </Grid>
            </Grid>
          ))}

          <div
            className={classes.container}
            style={{
              gridTemplateRows: `repeat(${dataMyHours.myHour.length},${height})`,
            }}
          >
            {data &&
              data.studentMyLessons.map((lesson) =>
                lesson.lessonWeeklySchedules.map((lw) => (
                  <div
                    key={lw._id}
                    style={{
                      gridColumn: lw.day + 1,
                      gridRow: lw.hourCode,
                    }}
                    className={classes.lessonContainer}
                  >
                    <Button
                      className={classes.lesson}
                      variant="contained"
                      color="primary"
                    >
                      {lesson.lessonName || lesson.name}
                    </Button>
                  </div>
                ))
              )}
            {dataAbsences &&
              dataAbsences.absences.map((absenceValue) => (
                <Grow in={true} timeout={800} key={absenceValue._id}>
                  <div
                    className={clsx(
                      classes.absenceContainer,
                      classes.lessonContainer
                    )}
                    style={{
                      gridColumn: absenceValue.day + 1,
                      gridRow: absenceValue.hourCode,
                    }}
                  >
                    <div>
                      <AbsenceIcon color="error" />
                    </div>
                  </div>
                </Grow>
              ))}
            {dataStudy &&
              dataMyHours &&
              dataStudy.studies.map((studyValue) => {
                const startDate = DateTime.fromISO(studyValue.date).toUTC();
                const endDate = startDate.plus({ minute: studyValue.duration });
                const schoolHour = dataMyHours.myHour.find((hourValue) => {
                  const startHour = DateTime.fromISO(hourValue.start);
                  const finishHour = DateTime.fromISO(hourValue.finish);
                  if (startHour.isValid && finishHour.isValid) {
                    if (
                      startHour.hour <= startDate.hour &&
                      finishHour.hour >= startDate.hour
                    )
                      return true;
                  }
                  return false;
                });
                if (schoolHour) {
                  const schoolHours = dataMyHours.myHour.filter((hourValue) => {
                    const startHour = DateTime.fromISO(hourValue.start);
                    const finishHour = DateTime.fromISO(hourValue.finish);
                    if (startHour.isValid && finishHour.isValid) {
                      if (
                        (startHour.hour <= startDate.hour &&
                          finishHour.hour >= startDate.hour) ||
                        (finishHour.hour >= startDate.hour &&
                          finishHour.hour <= endDate.hour)
                      )
                        return true;
                    }
                    return false;
                  });
                  return (
                    <div
                      key={studyValue._id}
                      className={clsx(
                        classes.studyContainer,
                        classes.lessonContainer
                      )}
                      style={{
                        gridColumn: startDate.weekday,
                        gridRow: schoolHour.code,
                        height: `${heightNumber * schoolHours.length}px`,
                      }}
                    >
                      <StudyButton onClick={() => setOpenStudy(studyValue)}>
                        {startDate.toFormat("HH:mm")}{" "}
                        {endDate.toFormat("HH:mm")} {studyValue.subject}
                      </StudyButton>
                    </div>
                  );
                }
                return <></>;
              })}
          </div>
        </Grid>
      )}
      {openStudy && (
        <StudyItemContainer
          setOpen={() => setOpenStudy()}
          study={openStudy}
          week={0}
        />
      )}
    </Paper>
  );
}
