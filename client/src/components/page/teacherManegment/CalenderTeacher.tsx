import { DateTime } from "luxon";
import * as React from "react";

import { Fab, Typography } from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

import {
  MyLessonsQuery,
  StudyFragment,
  useMyLessonsLazyQuery,
  useMyLessonsQuery,
  useStudiesQuery,
} from "../../../generated/graphql";
import Calender from "../../Calender/Calender";
import EventItem from "../../Calender/EventItem";
import {
  CalenderDayMap,
  CalenderEvent,
  CreateStudyVariables,
  EventItemDetail,
} from "../../myTypes";
import StudyContainerForm from "../../Study/Add/Container";
import StudyItemContainer from "../../Study/StudyItemContainer";
import EventDetail from "./Schedule/Detail";

const useStyles = makeStyles((theme) => ({
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
}));

const NEW_STUDY_ID = "newstudy";
enum EventEnum {
  teacherLesson,
  study,
  teacherOtherLesson,
}
type PropsType = {
  teacherId?: string;
};

export default function CalenderTeacher({ teacherId }: PropsType) {
  const [events, setEvents] = React.useState<CalenderDayMap>();
  const [studyDetail, setStudyDetail] = React.useState<StudyFragment>();
  const [lessonDetail, setLessonDetail] = React.useState<EventItemDetail>();
  const classes = useStyles();
  const [week, setWeek] = React.useState<number>(0);
  const [intersectionLesson, setIntersectionLesson] = React.useState<
    CalenderEvent[]
  >([]);
  const [newStudy, setNewStudy] = React.useState<CreateStudyVariables>();
  const [fetchOtherLesson] = useMyLessonsLazyQuery({
    onCompleted: (tData) => {
      const { schools } = tData;
      setEvents((e) => {
        const eventMap: CalenderDayMap = e ? new Map(e) : new Map();
        for (let index = 0; index < 7; index++) {
          let calenderEvents = eventMap.get(index);
          if (calenderEvents) {
            calenderEvents = calenderEvents.filter(
              (c) => c.type !== EventEnum.teacherOtherLesson
            );
            eventMap.set(index, calenderEvents);
          }
        }
        extractSchoolLessons(
          schools,
          eventMap,
          setLessonDetail,
          EventEnum.teacherOtherLesson,
          true
        );
        return eventMap;
      });
    },
    fetchPolicy: "cache-and-network",
    onError: () => {},
  });

  const { loading } = useMyLessonsQuery({
    onCompleted: (tData) => {
      const { schools } = tData;
      setEvents((e) => {
        const eventMap: CalenderDayMap = e ? new Map(e) : new Map();
        for (let index = 0; index < 7; index++) {
          let calenderEvents = eventMap.get(index);
          if (calenderEvents) {
            calenderEvents = calenderEvents.filter(
              (c) => c.type !== EventEnum.teacherLesson
            );
            eventMap.set(index, calenderEvents);
          }
        }
        extractSchoolLessons(
          schools,
          eventMap,
          setLessonDetail,
          EventEnum.teacherLesson
        );
        return eventMap;
      });
    },
    fetchPolicy: "cache-and-network",
    onError: () => {},
    variables: { week, teacherId },
  });
  const { loading: sLoading } = useStudiesQuery({
    variables: { week, teacherId },
    onError: () => {},
    onCompleted: (tData) => {
      const { studies } = tData;
      setEvents((e) => {
        const eventMap: CalenderDayMap = e ? new Map(e) : new Map();
        for (let index = 0; index < 7; index++) {
          let calenderEvents = eventMap.get(index);
          if (calenderEvents) {
            calenderEvents = calenderEvents.filter(
              (c) => c.type !== EventEnum.study
            );
            eventMap.set(index, calenderEvents);
          }
        }
        for (const study of studies) {
          const date = DateTime.fromISO(study.dateTimeSpan);
          const weekday = DateTime.fromISO(study.date).weekday - 1;
          console.log(date.toISODate());

          let calenderEvents = eventMap.get(weekday);
          const startHour = date.toFormat("HH:mm");
          const endHour = date
            .plus({ minutes: study.duration })
            .toLocaleString(DateTime.TIME_24_SIMPLE);
          const calenderEvent: CalenderEvent = {
            _id: study._id,
            endHour,
            startHour,
            title: study.lessonName,
            type: EventEnum.study,
            event: (
              <EventItem
                color="secondary"
                onClick={() => setStudyDetail(study)}
              >
                <Typography>{study.subject}</Typography>
                <Typography variant="body2">
                  {startHour}&nbsp;- {endHour}
                </Typography>
              </EventItem>
            ),
          };
          if (calenderEvents) {
            calenderEvents.push(calenderEvent);
            eventMap.set(weekday, calenderEvents);
          } else eventMap.set(weekday, [calenderEvent]);
        }
        return eventMap;
      });
    },
  });
  const handleOnChangeStudy = (value: CreateStudyVariables) => {
    if (!newStudy) return;
    if (value.permissionClasses) {
      if (value.permissionClasses !== newStudy.permissionClasses) {
        fetchOtherLesson({
          variables: {
            classes: value.permissionClasses,
            notMine: true,
          },
        });
      }
    }
    const newEvent = cleanAndAddStudy(newStudy, value);
    newEvent && setEvents(newEvent);
    const newWeek = DateTime.fromISO(value.date)
      .startOf("weeks")
      .diff(DateTime.local().startOf("weeks"), "weeks").weeks;
    if (newWeek !== week) {
      setWeek(newWeek);
    }

    const startDateValue = DateTime.fromISO(value.date);
    const weekday = startDateValue.weekday - 1;
    const endDateValue = startDateValue.plus({ minutes: value.duration });
    const calenderEvents = events?.get(weekday);
    if (
      calenderEvents?.some((value) =>
        DateTime.fromISO(value.startHour).hasSame(startDateValue, "day")
      )
    ) {
      const intersectionArray: CalenderEvent[] = [];
      for (const scheduleItem of calenderEvents || []) {
        const startDate = DateTime.fromISO(scheduleItem.startHour);
        const endDate = DateTime.fromISO(scheduleItem.endHour);
        if (
          (startDateValue >= startDate && startDateValue <= endDate) ||
          (endDateValue >= startDate && endDateValue <= endDate) ||
          (startDateValue <= startDate && endDateValue >= endDate)
        ) {
          intersectionArray.push(scheduleItem);
        }
      }
      !(intersectionLesson.length === 0 && intersectionArray.length === 0) &&
        setIntersectionLesson(intersectionArray);
    }

    setNewStudy(value);
  };
  const hadnleOpenNewStudy = () => {
    const study = new CreateStudyVariables();
    setNewStudy(study);
    if (events) {
      const newEvent = changeStudyEvent(events, study);
      newEvent && setEvents(newEvent);
    }
  };
  const changeStudyEvent = (
    eventMap: CalenderDayMap,
    study: CreateStudyVariables
  ) => {
    const newEvent = new Map(eventMap);
    const datetime = DateTime.fromISO(study.date);
    const weekday = datetime.weekday - 1;
    const calenderEvents = newEvent.get(weekday);
    const calenderEvent: CalenderEvent = {
      _id: NEW_STUDY_ID,
      startHour: datetime.toLocaleString(DateTime.TIME_24_SIMPLE),
      endHour: datetime
        .plus({ minutes: study.duration })
        .toLocaleString(DateTime.TIME_24_SIMPLE),
      event: <EventItem>YENİ ETÜT</EventItem>,
    };
    calenderEvents
      ? calenderEvents.push(calenderEvent)
      : newEvent.set(weekday, [calenderEvent]);
    return newEvent;
  };
  const handleCloseNewStudy = () => {
    if (newStudy && events) {
      const newEvent = cleanStudy(events, newStudy);
      newEvent && setEvents(newEvent);
    }
    setNewStudy(undefined);
  };

  const cleanStudy = (
    eventMap: CalenderDayMap,
    study: CreateStudyVariables
  ) => {
    const date = DateTime.fromISO(study.date);
    const weekday = date.weekday - 1;
    const newEvent = new Map(eventMap);
    const calenderEvents = newEvent.get(weekday);
    if (calenderEvents) {
      const exludeStudyEvents = calenderEvents.filter(
        (c) => c._id !== NEW_STUDY_ID
      );
      newEvent.set(weekday, exludeStudyEvents);
      return newEvent;
    }
  };
  const cleanAndAddStudy = (
    oldStudy: CreateStudyVariables,
    newStudy: CreateStudyVariables
  ) => {
    if (events) {
      const cleanedEvent = cleanStudy(events, oldStudy);
      if (cleanedEvent) {
        return changeStudyEvent(cleanedEvent, newStudy);
      }
    }
  };
  const hadnleChangeWeek = (weekday: number) => {
    setWeek(weekday);
  };
  if (events)
    return (
      <>
        <Calender
          dayweek={week}
          loading={loading || sLoading}
          events={events}
          onChangeWeek={hadnleChangeWeek}
        />
        {!newStudy ? (
          <>
            {!teacherId && (
              <Fab
                aria-label="Add Study"
                className={classes.flotingButton}
                color="primary"
                variant="extended"
                onClick={hadnleOpenNewStudy}
              >
                <AddIcon />
                YENİ ETÜT
              </Fab>
            )}
          </>
        ) : (
          <StudyContainerForm
            newStudy={newStudy}
            onValuesChange={handleOnChangeStudy}
            close={handleCloseNewStudy}
            week={week}
            intersection={[]}
          />
        )}
        {studyDetail && (
          <StudyItemContainer
            study={studyDetail}
            setOpen={() => setStudyDetail(undefined)}
            week={week}
          />
        )}
        {lessonDetail && (
          <EventDetail
            values={lessonDetail}
            setOpen={() => setLessonDetail(undefined)}
          />
        )}
      </>
    );
  return <span></span>;
}
function extractSchoolLessons(
  schools: MyLessonsQuery["schools"],
  eventMap: CalenderDayMap,
  setLessonDetail: React.Dispatch<
    React.SetStateAction<EventItemDetail | undefined>
  >,
  eventEnum: EventEnum,
  danger?: boolean
) {
  for (const school of schools) {
    for (const classData of school.classes) {
      for (const lesson of classData.lessons || []) {
        const { __typename: _t, ...lessonRest } = lesson;
        for (const lessonSchedule of lesson.lessonWeeklySchedules) {
          let calenderEvents = eventMap.get(lessonSchedule.day);
          const hour = school.weeklyHour?.hour.find(
            (h) => h.code === lessonSchedule.hourCode
          );
          if (hour) {
            const { __typename, ...hourRest } = hour;
            const detail: EventItemDetail = {
              ...lessonRest,
              ...hourRest,
              schoolName: school.name,
              className: `${classData.level} ${classData.code} ${
                classData.code1 || ""
              } ${classData.name || ""}`,
              ...lessonSchedule,
            };
            const calenderEvent: CalenderEvent = {
              _id: lessonSchedule._id,
              endHour: hour.finish,
              startHour: hour.start,
              title: lesson.lessonName || "",
              type: eventEnum,
              event: (
                <EventItem
                  onClick={() => setLessonDetail(detail)}
                  danger={danger}
                >
                  <Typography>{lesson.lessonName}</Typography>
                  <Typography variant="body2">{classData.fullName}</Typography>
                </EventItem>
              ),
            };
            if (calenderEvents) {
              calenderEvents.push(calenderEvent);
              eventMap.set(lessonSchedule.day, calenderEvents);
            } else eventMap.set(lessonSchedule.day, [calenderEvent]);
          }
        }
      }
    }
  }
}
