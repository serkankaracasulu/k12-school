import clsx from "clsx";
import { DateTime } from "luxon";
import * as React from "react";

import {
  Button,
  ButtonGroup,
  Container,
  Divider,
  Fab,
  Grid,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import Fade from "@material-ui/core/Fade";
import { makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
} from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";

import {
  CreateStudyMutationVariables,
  MyLessonsQuery,
  StudyFragment,
  useMyLessonsLazyQuery,
  useMyLessonsQuery,
  useStudiesQuery,
} from "../../../../generated/graphql";
import { CreateStudyVariables } from "../../../myTypes";
import StudyFormContainer from "../../../Study/Add/Container";
import StudyDetail from "../../../Study/StudyItemContainer";
import { ScheduleItemType } from "./flow";

const height = "60px";
const width = "80px";
const containerWidth = "800px";

const StudyButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(red[500]),
    opacity: "0.7",
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
    },
    position: "absolute",
  },
}))(Button);

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      height: `calc(100% - (${theme.mixins.toolbar.minHeight}px + ${height} ))`,
    },
    position: "relative",
    height: `calc(100% - (${theme.mixins.toolbar.minHeight}px + ${theme.spacing(
      2
    )}px))`,
  },
  paper: {
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  borderContent: {
    content: "",
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    position: "absolute",
    width: "100%",
    pointerEvents: "none",
  },
  scheduleContainer: {
    position: "relative",
    minWidth: containerWidth,
  },
  scheduleItem: {
    minWidth: width,
    borderRight: "1px solid rgba(224, 224, 224, 1)",
    position: "relative",
    paddingRight: theme.spacing(1),
  },
  items: {
    display: "flex",
  },
  hours: {
    borderRight: "1px solid rgba(224, 224, 224, 1)",
    position: "sticky",
    left: 0,
    backgroundColor: "#fafafa",
    zIndex: theme.zIndex.drawer - 1,
  },
  hourItem: {
    height,
    width: "40px",
    marginLeft: theme.spacing(1),
  },
  flotingButton: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      bottom: theme.mixins.toolbar.minHeight
        ? +theme.mixins.toolbar.minHeight + theme.spacing(2)
        : 0,
    },
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
    },
  },
  verticalContent: {},
  verticalItemC: { height },
  verticalItem: {
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    position: "absolute",
    width: "100%",
    pointerEvents: "none",
    content: "",
  },
  scheduleItems: {
    height: "100%",
    position: "relative",
  },
  scheduleItemDiv: {
    position: "relative",
    width: "100%",
  },
  scheduleItemContainer: {
    flexGrow: 1,
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
  },
  titleContainer: {
    minWidth: containerWidth,
    position: "sticky",
    top: 0,
    backgroundColor: "#fafafa",
    zIndex: theme.zIndex.drawer,
  },
  scheduleTitle: {
    textAlign: "center",
    marginTop: theme.spacing(1),
  },
  today: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: theme.palette.primary.main,
  },
  activity: {
    width: "100%",
    position: "absolute",
    justifyContent: "flex-start",
    minWidth: theme.spacing(2),
    boxShadow: "none",
    "&:hover": {
      boxShadow: "none",
    },
    padding: 0,
    "& span": {
      textTransform: "none",
      whiteSpace: "nowrap",
      overflow: "hidden",
      paddingLeft: theme.spacing(1),
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    "&::before": {
      content: "''",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    },
    "&::after": {
      content: "''",
      position: "absolute",
      top: "-1px",
      left: "-1px",
      width: "105%",
      height: "105%",
      pointerEvents: "none",
    },
  },
  hoverLesson: {
    "&::before": {
      content: "''",
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      background: theme.palette.background.paper,
      height: "4px",
      WebkitTransitionProperty: "left, right",
      transitionProperty: "left, right",
      WebkitTransitionDuration: "0.3s",
      transitionDuration: "0.3s",
      WebkitTransitionTimingFunction: "ease-out",
      transitionTimingFunction: "ease-out",
    },
  },
  studyItem: {
    backgroundColor: "#3a607d",
    color: "white",
    opacity: "0.7",
  },
  newStudyFormContainer: {},
  navigate: {
    margin: theme.spacing(1, 0, 1, 0),
    paddingRight: theme.spacing(2),
  },
  todayDate: {
    flexGrow: 0.4,
    fontWeight: 500,
    color: "#565656",
  },
}));
const hours = [
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "24:00",
];
const initialStartCode = 6;
const initialEndCode = 17;
const now = DateTime.utc();
const startOfWeek = now.startOf("weeks");
const endOfWeek = now.endOf("weeks");
const generateDays = (w: number) => {
  return [0, 1, 2, 3, 4, 5, 6].map((_, index) => {
    const startOfWeekplus = startOfWeek.plus({ weeks: w });
    const startOfWeekPlus = startOfWeekplus.plus({ day: index });
    return {
      day: startOfWeekPlus.day,
      shortName: startOfWeekPlus.weekdayShort,
      today: startOfWeekPlus.hasSame(now, "day"),
      fullDay: startOfWeekPlus,
    };
  });
};
interface IStudyDate extends Omit<StudyFragment, "date"> {
  date: DateTime;
}
interface HourStartEnd {
  start: number;
  end: number;
}
export default function Schedule() {
  const classes = useStyles();
  const [week, setWeek] = React.useState<number>(0);
  const [hourStartEnd, sethourStartEnd] = React.useState<HourStartEnd>({
    start: initialStartCode,
    end: initialEndCode,
  });
  const startTime = DateTime.fromISO(hours[hourStartEnd.start]);
  const [
    newStudy,
    setNewStudy,
  ] = React.useState<CreateStudyMutationVariables | void>();
  const [intersectionLesson, setIntersectionLesson] = React.useState<
    ScheduleItemType[]
  >([]);
  const [_, setOpenDetail] = React.useState<ScheduleItemType | void>();
  const [studieArray, setStudieArray] = React.useState<IStudyDate[][]>([]);
  const [studyDetail, setStudyDetail] = React.useState<StudyFragment | void>();

  const [scheduleArray, setScheduleArray] = React.useState<
    ScheduleItemType[][]
  >([0, 1, 2, 3, 4, 5, 6].map(() => []));
  const [scheduleStudyArray, setScheduleStudyArray] = React.useState<
    ScheduleItemType[][]
  >([0, 1, 2, 3, 4, 5, 6].map(() => []));
  const [days, setDays] = React.useState(generateDays(0));
  const handleFecthOtherLesson = (pClasses: string[]) => {
    fetchOtherLesson({
      variables: {
        classes: pClasses,
        notMine: true,
      },
    });
  };
  const handleSetStudy = (value: CreateStudyMutationVariables | void) => {
    if (newStudy && value) {
      if (value.permissionClasses) {
        if (value.permissionClasses !== newStudy.permissionClasses) {
          handleFecthOtherLesson(value.permissionClasses);
        }
      }
      const newWeek = DateTime.fromISO(value.date)
        .startOf("weeks")
        .diff(DateTime.local().startOf("weeks"), "weeks").weeks;
      if (newWeek !== week) {
        schoolQuertResult.refetch({ week: newWeek });
        setDays(generateDays(newWeek));
        setWeek(newWeek);
      }
      const startDateValue = DateTime.fromISO(value.date);
      const endDateValue = startDateValue.plus({ minutes: value.duration });
      if (
        scheduleArray[startDateValue.weekday - 1].some((value) =>
          value.startDate.hasSame(startDateValue, "day")
        )
      ) {
        const intersectionArray: ScheduleItemType[] = [];
        for (const scheduleItem of scheduleArray[startDateValue.weekday - 1]) {
          if (
            (startDateValue.valueOf() >= scheduleItem.startDate.valueOf() &&
              startDateValue.valueOf() <= scheduleItem.endDate.valueOf()) ||
            (endDateValue.valueOf() >= scheduleItem.startDate.valueOf() &&
              endDateValue.valueOf() <= scheduleItem.endDate.valueOf()) ||
            (startDateValue.valueOf() <= scheduleItem.startDate.valueOf() &&
              endDateValue.valueOf() >= scheduleItem.endDate.valueOf())
          ) {
            intersectionArray.push(scheduleItem);
          }
        }
        !(intersectionLesson.length === 0 && intersectionArray.length === 0) &&
          setIntersectionLesson(intersectionArray);
      }
    }
    setNewStudy(value);
  };
  const { data } = useStudiesQuery({
    variables: { week },
    onError: (err) => {},
  });
  const generateStudyArray = React.useCallback(() => {
    if (data) {
      const newArray: IStudyDate[][] = days.map(() => []);
      let minHour = 25;
      let maxHour = 0;
      for (const study of data.studies) {
        const date = DateTime.fromISO(study.date.toString()).toUTC();
        if (
          date.valueOf() > startOfWeek.plus({ weeks: week }).valueOf() &&
          date.valueOf() < endOfWeek.plus({ weeks: week }).valueOf()
        ) {
          const startHour = date.hour === 0 ? 24 : date.hour;
          let endHour = date.plus({ minutes: study.duration }).hour;
          endHour = endHour === 0 ? 24 : endHour;
          if (minHour > startHour) minHour = startHour;
          if (maxHour < endHour) maxHour = endHour;
          newArray[date.weekday - 1].push({ ...study, date });
        }
      }
      if (minHour < initialStartCode || maxHour > initialEndCode) {
        sethourStartEnd({
          start: minHour < initialStartCode ? minHour : initialStartCode,
          end: maxHour > initialEndCode ? maxHour : initialEndCode,
        });
      }

      setStudieArray(newArray);
    }
  }, [data, days, week]);
  React.useEffect(() => {
    generateStudyArray();
  }, [generateStudyArray]);
  const schoolQuertResult = useMyLessonsQuery({
    onCompleted: (tData) => {
      const { schools } = tData;
      generateScheduleItems(
        schools,
        setScheduleArray,
        startTime,
        sethourStartEnd,
        week
      );
    },
    onError: (err) => {},
  });
  const [fetchOtherLesson, { loading }] = useMyLessonsLazyQuery({
    onCompleted: (tData) => {
      const { schools } = tData;
      generateScheduleItems(
        schools,
        setScheduleStudyArray,
        startTime,
        sethourStartEnd,
        week
      );
    },
    fetchPolicy: "cache-and-network",
    onError: (err) => {},
  });

  const handleBackForward = (back: boolean, today?: boolean) => {
    const newWeek = today ? 0 : back ? week - 1 : week + 1;
    schoolQuertResult.refetch({ week: newWeek });
    setDays(generateDays(newWeek));
    setWeek(newWeek);
  };
  const [hoverLessonId, setHoverLessonId] = React.useState("");
  const handleMouseOver = (value: string) => {
    setHoverLessonId(value);
  };
  const handleOpen = (scheduleItem: ScheduleItemType) => {
    setOpenDetail(scheduleItem);
  };
  return (
    <>
      <Container maxWidth="lg" className={classes.container}>
        <div className={classes.paper}>
          {(loading || schoolQuertResult.loading) && <LinearProgress />}
          <Grid
            container
            justify="flex-end"
            alignItems="center"
            className={classes.navigate}
          >
            <Typography className={classes.todayDate}>
              {now
                .plus({ weeks: week })
                .toLocaleString({ month: "long", year: "numeric" })}
            </Typography>
            <ButtonGroup variant="text" color="primary">
              <Button onClick={() => handleBackForward(true)}>
                <BackIcon />
              </Button>
              <Button
                style={{ textTransform: "capitalize" }}
                onClick={() => handleBackForward(true, true)}
              >
                Bugün
              </Button>
              <Button onClick={() => handleBackForward(false)}>
                <ForwardIcon />
              </Button>
            </ButtonGroup>
          </Grid>
          <Divider />
          <Fade in={!schoolQuertResult.loading}>
            <Grid container direction="column">
              <Grid container className={classes.titleContainer}>
                <Grid item className={classes.hourItem} />
                {days.map((d) => (
                  <Grid
                    item
                    xs
                    className={clsx(
                      classes.scheduleTitle,
                      d.today ? classes.today : undefined
                    )}
                    key={d.day}
                  >
                    <Typography>{d.shortName}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {d.day}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              <Grid
                container
                className={classes.scheduleContainer}
                direction="row"
              >
                <div className={classes.hours}>
                  {hours
                    .slice(hourStartEnd.start, hourStartEnd.end)
                    .map((h) => (
                      <div className={classes.hourItem} key={h}>
                        <Typography color="textSecondary" variant="caption">
                          {h}
                        </Typography>
                      </div>
                    ))}
                </div>
                <Grid item className={classes.scheduleItemContainer}>
                  <Grid
                    container
                    direction="row"
                    alignItems="stretch"
                    className={classes.scheduleItems}
                  >
                    <div className={classes.verticalContent}>
                      {hours
                        .slice(hourStartEnd.start, hourStartEnd.end)
                        .map((h) => (
                          <div className={classes.verticalItemC} key={h}>
                            <div className={classes.verticalItem} />
                          </div>
                        ))}
                    </div>
                    {days.map((d, index) => (
                      <Grid
                        container
                        item
                        xs
                        key={d.day}
                        className={classes.scheduleItem}
                      >
                        <div className={classes.scheduleItemDiv}>
                          {scheduleArray[index].map((t) => (
                            <Button
                              variant="contained"
                              key={t._id}
                              style={{
                                top: `${t.top}px`,
                                height: `${t.height}px`,
                              }}
                              onMouseOver={() => handleMouseOver(t.courseId)}
                              onFocus={() => handleMouseOver(t.courseId)}
                              onMouseLeave={() => setHoverLessonId("")}
                              color="primary"
                              className={
                                t.courseId === hoverLessonId
                                  ? clsx(classes.activity, classes.hoverLesson)
                                  : classes.activity
                              }
                              onClick={() => handleOpen(t)}
                            >
                              <Typography>
                                {t.schoolClass.level} {t.schoolClass.code}{" "}
                                {t.lessonName}
                              </Typography>
                              <Typography variant="body2">
                                {t.hour.start}&nbsp;- {t.hour.finish}
                              </Typography>
                            </Button>
                          ))}
                          {newStudy &&
                            newStudy.permissionClasses &&
                            scheduleStudyArray[index].map((t) => (
                              <Button
                                variant="contained"
                                key={t._id}
                                style={{
                                  top: `${t.top}px`,
                                  height: `${t.height}px`,
                                }}
                                onMouseOver={() => handleMouseOver(t.courseId)}
                                onFocus={() => handleMouseOver(t.courseId)}
                                onMouseLeave={() => setHoverLessonId("")}
                                color="secondary"
                                className={
                                  t.courseId === hoverLessonId
                                    ? clsx(
                                        classes.activity,
                                        classes.hoverLesson
                                      )
                                    : classes.activity
                                }
                                onClick={() => handleOpen(t)}
                              >
                                <Typography>
                                  {t.schoolClass.level} {t.schoolClass.code}{" "}
                                  {t.lessonName}
                                </Typography>
                                <Typography variant="body2">
                                  {t.hour.start}&nbsp;-
                                  {t.hour.finish}
                                </Typography>
                              </Button>
                            ))}
                          {newStudy &&
                            d.fullDay.hasSame(
                              DateTime.fromISO(newStudy.date),
                              "day"
                            ) && (
                              <StudyButton
                                variant="contained"
                                className={classes.activity}
                                style={{
                                  top: `${
                                    calcItemTop(
                                      DateTime.fromISO(newStudy.date),
                                      startTime
                                    ) || 0
                                  }px`,
                                  height: `${newStudy.duration}px`,
                                }}
                              >
                                Etüt
                              </StudyButton>
                            )}
                          {studieArray[index]?.map((studieValue) => (
                            <StudyButton
                              key={studieValue._id}
                              className={classes.activity}
                              onClick={() =>
                                setStudyDetail({
                                  ...studieValue,
                                  date: studieValue.date.toISODate() as string,
                                })
                              }
                              style={{
                                top: calcItemTop(studieValue.date, startTime),
                                height: studieValue.duration,
                              }}
                            >
                              {studieValue.subject}
                              <Typography variant="body2">
                                {studieValue.date.toFormat("HH:mm")}
                                &nbsp;-&nbsp;
                                {studieValue.date
                                  .plus({ minutes: studieValue.duration })
                                  .toFormat("HH:mm")}
                              </Typography>
                            </StudyButton>
                          ))}
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Fade>
        </div>
      </Container>
      {!newStudy ? (
        <Fab
          aria-label="Add Study"
          className={classes.flotingButton}
          color="primary"
          variant="extended"
          onClick={() => setNewStudy(new CreateStudyVariables())}
        >
          <AddIcon />
          YENİ ETÜT
        </Fab>
      ) : (
        <StudyFormContainer
          newStudy={newStudy}
          onValuesChange={handleSetStudy}
          week={week}
          close={() => setNewStudy(undefined)}
          intersection={intersectionLesson}
        />
      )}
      {studyDetail && (
        <StudyDetail
          study={studyDetail}
          setOpen={() => setStudyDetail()}
          week={week}
        />
      )}
    </>
  );
}
function generateScheduleItems(
  schools: MyLessonsQuery["schools"],
  setScheduleArray: React.Dispatch<React.SetStateAction<ScheduleItemType[][]>>,
  startTime: DateTime,
  sethourStartEnd: React.Dispatch<React.SetStateAction<HourStartEnd>>,
  week: number
) {
  const totalArray: ScheduleItemType[][] = [0, 1, 2, 3, 4, 5, 6].map(() => []);
  let minHour = startTime.hour;
  let maxHour = 0;
  for (const school of schools) {
    for (const cl of school.classes) {
      if (cl && cl.lessons) {
        for (const lesson of cl.lessons) {
          for (const ls of lesson.lessonWeeklySchedules) {
            const { lessonWeeklySchedules, ...restLesson } = lesson;
            const hour =
              school.weeklyHour &&
              school.weeklyHour.hour.find((h) => h.code === ls.hourCode);
            if (hour) {
              const [hourStartPart, minuteStartPart] = hour.start.split(":");
              const [hourfinishPart, minutefinishPart] = hour.finish.split(":");
              const thisWeek = startOfWeek.plus({ weeks: week });
              const lessonStartTime = DateTime.local(
                thisWeek.year,
                thisWeek.month,
                thisWeek.day,
                +hourStartPart,
                +minuteStartPart
              ).plus({ days: ls.day });
              const lessonEndTime = DateTime.local(
                thisWeek.year,
                thisWeek.month,
                thisWeek.day,
                +hourfinishPart,
                +minutefinishPart
              ).plus({ days: ls.day });
              if (lessonStartTime && minHour > lessonStartTime.hour) {
                minHour = lessonStartTime.hour;
              }
              if (lessonEndTime && maxHour < lessonEndTime.hour) {
                maxHour = lessonEndTime.hour;
              }
              const lessonHeight =
                lessonEndTime &&
                lessonStartTime &&
                lessonEndTime.diff(lessonStartTime, "minutes").as("minutes");
              const top = calcItemTop(lessonStartTime, startTime);
              lessonHeight &&
                top &&
                totalArray[ls.day].push({
                  _id: ls._id,
                  lessonName: restLesson.lessonName || restLesson.name || "",
                  hour,
                  courseId: restLesson._id,
                  height: lessonHeight,
                  schoolName: school.name,
                  schoolClass: { ...cl },
                  top,
                  day: ls.day,
                  startDate: lessonStartTime,
                  endDate: lessonEndTime,
                });
            }
          }
        }
      }
    }
  }
  const startHour = minHour === 0 ? 24 : minHour;
  const endHour = maxHour === 0 ? 24 : maxHour;
  if (startHour < initialStartCode || endHour > initialEndCode) {
    sethourStartEnd({
      start: startHour < initialStartCode ? startHour : initialStartCode,
      end: endHour > initialEndCode ? endHour : initialEndCode,
    });
  }
  setScheduleArray(totalArray);
}
function calcItemTop(date: DateTime | undefined, startTime: DateTime) {
  return (
    date &&
    DateTime.fromObject({ hour: date.hour, minute: date.minute })
      .diff(startTime, ["minutes"])
      .as("minutes")
  );
}
