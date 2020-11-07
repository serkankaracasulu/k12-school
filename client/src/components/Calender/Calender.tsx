import clsx from "clsx";
import { DateTime } from "luxon";
import * as React from "react";

/* eslint-disable react/prop-types */
import {
  Button,
  ButtonGroup,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
} from "@material-ui/icons";

import { ClassType, Hour } from "../../generated/graphql";
import {
  CalenderDayMap,
  CalenderDayMapRender,
  CalenderEvent,
  CalenderEventRender,
} from "../myTypes";

const HEIGHT = "60px";
const WIDTH = "80px";
const CONTAINER_WIDTH = "800px";

export type ScheduleItemType = {
  _id: string;
  lessonName: string;
  schoolName: string;
  schoolClass: ClassType;
  hour: Hour;
  top: number;
  height: number;
  courseId: string;
  day: number;
  startDate: DateTime;
  endDate: DateTime;
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      height: `calc(100% - (${theme.mixins.toolbar.minHeight}px + ${HEIGHT} ))`,
    },
    position: "relative",
    height: "85vh",
    /*
    height: `calc(100% - (${theme.mixins.toolbar.minHeight}px + ${theme.spacing(
      2
    )}px))`,
    */
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
  scheduleContainer: {
    position: "relative",
    minWidth: CONTAINER_WIDTH,
  },
  scheduleItem: {
    minWidth: WIDTH,
    borderRight: "1px solid rgba(224, 224, 224, 1)",
    position: "relative",
    paddingRight: theme.spacing(1),
  },
  items: {
    display: "flex",
  },
  eventItem: {
    width: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  hours: {
    borderRight: "1px solid rgba(224, 224, 224, 1)",
    position: "sticky",
    left: 0,
    backgroundColor: "#fafafa",
    zIndex: theme.zIndex.drawer - 1,
  },
  hourItem: {
    height: HEIGHT,
    width: "40px",
    marginLeft: theme.spacing(1),
  },
  verticalItemC: { height: HEIGHT },
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
  scheduleItemContainer: {
    flexGrow: 1,
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
  },
  titleContainer: {
    minWidth: CONTAINER_WIDTH,
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
const HOURS = [
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
const INITIAL_HOUR_START = 6;
const INITIAL_HOUR_END = 17;
const now = DateTime.utc();
const startOfWeek = now.startOf("weeks");
const generateDays = (w: number = 0) => {
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

interface HourStartEnd {
  start: number;
  end: number;
}
type CalenderProp = {
  loading?: boolean;
  events: CalenderDayMap;
  onChangeWeek(week: number): void;
  dayweek: number;
};

const Calender: React.FC<CalenderProp> = ({
  loading,
  events,
  onChangeWeek,
  dayweek,
}) => {
  const classes = useStyles();
  const [hourStartEnd, sethourStartEnd] = React.useState<HourStartEnd>({
    start: INITIAL_HOUR_START,
    end: INITIAL_HOUR_END,
  });
  const [week, setWeek] = React.useState<number>(dayweek);
  const [days, setDays] = React.useState(generateDays);
  const tranferToRender = () => {
    const eventListMin: number[] = [];
    const eventListMax: number[] = [];
    for (let index = 0; index < days.length; index++) {
      const event = events.get(index);
      if (event) {
        for (const e of event) {
          const startTimeDate = timeSpanToDateTime(e.startHour, week, index);
          eventListMax.push(DateTime.fromISO(e.endHour).hour);
          eventListMin.push(startTimeDate.hour);
        }
      }
    }
    const calenderMap = new Map<number, CalenderEventRender[]>();
    let minHour = Math.min(...eventListMin) - 1;
    minHour = INITIAL_HOUR_START < minHour ? INITIAL_HOUR_START : minHour;
    let maxHour = Math.max(...eventListMax);
    let maxForstart = Math.max(...eventListMin);
    maxHour = maxHour > maxForstart ? maxHour : maxForstart;
    maxHour = maxHour === -Infinity ? INITIAL_HOUR_END : maxHour;
    for (let index = 0; index < days.length; index++) {
      const calenderEvents = events.get(index);
      const calenderEventRenders: CalenderEventRender[] = [];
      if (calenderEvents) {
        for (const calenderEvent of calenderEvents) {
          const durationMinute = getDuration(calenderEvent);
          const [startDate, endDate, top] = calcItemTop(
            calenderEvent.startHour,
            durationMinute,
            index,
            DateTime.fromISO(HOURS[minHour])
          );

          const finded =
            calenderEvents?.filter((e) => {
              const findStartTime = timeSpanToDateTime(
                e.startHour,
                week,
                index
              );
              const findEndTime = findStartTime.plus({
                minutes: durationMinute,
              });
              return (
                (startDate <= findStartTime && endDate >= findStartTime) ||
                (endDate >= findEndTime && startDate <= findEndTime)
              );
            }) || [];

          const thisIndex = finded.findIndex(
            (f) => f._id === calenderEvent._id
          );
          const widthX = Math.floor(100 / finded.length);
          const left = 100 - widthX * (finded.length - thisIndex);
          const width = 100 - left;

          const calenderEventRender: CalenderEventRender = {
            top,
            startDate,
            endDate,
            height: durationMinute,
            left: `${left}%`,
            width: `${width}%`,
            ...calenderEvent,
            zIndex: thisIndex,
            durationMinute: durationMinute,
          };

          calenderEventRenders.push(calenderEventRender);
        }
      }
      calenderMap.set(index, calenderEventRenders);
    }
    sethourStartEnd({
      start: minHour,
      end: maxHour,
    });
    return calenderMap;
  };

  const [evetRender, setEventRender] = React.useState<CalenderDayMapRender>(
    tranferToRender
  );
  React.useEffect(() => {
    setWeek(dayweek);
    setDays(generateDays(dayweek));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayweek]);
  React.useEffect(() => {
    setEventRender(tranferToRender);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);
  const handleBackForward = (back: boolean, today?: boolean) => {
    const newWeek = today ? 0 : back ? week - 1 : week + 1;
    setDays(generateDays(newWeek));
    setWeek(newWeek);
    onChangeWeek(newWeek);
  };
  function calcItemTop(
    startHour: string,
    durationMinute: number,
    day: number,
    startTime: DateTime
  ): [DateTime, DateTime, number] {
    const startTimeDate = timeSpanToDateTime(startHour, week, day);
    const endtTimeDate = startTimeDate.plus({ minutes: durationMinute });
    return [
      startTimeDate,
      endtTimeDate,
      DateTime.fromObject({
        hour: startTimeDate.hour,
        minute: startTimeDate.minute,
      })
        .diff(startTime, ["minutes"])
        .as("minutes"),
    ];
  }
  return (
    <>
      <Container maxWidth="lg" className={classes.container}>
        <div className={classes.paper}>
          {loading && <LinearProgress />}
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
          <Fade in={!loading}>
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
                  {HOURS.slice(hourStartEnd.start, hourStartEnd.end).map(
                    (h) => (
                      <div className={classes.hourItem} key={h}>
                        <Typography color="textSecondary" variant="caption">
                          {h}
                        </Typography>
                      </div>
                    )
                  )}
                </div>
                <Grid item className={classes.scheduleItemContainer}>
                  <Grid
                    container
                    direction="row"
                    alignItems="stretch"
                    className={classes.scheduleItems}
                  >
                    <div>
                      {HOURS.slice(hourStartEnd.start, hourStartEnd.end).map(
                        (h) => (
                          <div className={classes.verticalItemC} key={h}>
                            <div className={classes.verticalItem} />
                          </div>
                        )
                      )}
                    </div>
                    {days.map((dayItem, index) => (
                      <Grid
                        container
                        item
                        xs
                        key={dayItem.day}
                        className={classes.scheduleItem}
                      >
                        {evetRender.get(index)?.map((event) => (
                          <Tooltip
                            key={event._id}
                            title={`${event.startHour} ⋅ ${
                              event.durationMinute
                            } dakika ${event.title ? ` ⋅ ${event.title}` : ""}`}
                          >
                            <div
                              className={classes.eventItem}
                              style={{
                                top: event.top,
                                height: event.height,
                                left: event.left,
                                width: event.width,
                                zIndex: event.zIndex,
                              }}
                            >
                              {event.event}
                            </div>
                          </Tooltip>
                        ))}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Fade>
        </div>
      </Container>
    </>
  );
};
export default Calender;
function getDuration(calenderEvent: CalenderEvent) {
  return DateTime.fromISO(calenderEvent.endHour)
    .diff(DateTime.fromISO(calenderEvent.startHour), ["minutes"])
    .as("minutes");
}

function timeSpanToDateTime(startHour: string, week: number, day: number) {
  const [hourStartPart, minuteStartPart] = startHour.split(":");
  const thisWeek = startOfWeek.plus({ weeks: week });
  const startTimeDate = DateTime.local(
    thisWeek.year,
    thisWeek.month,
    thisWeek.day,
    +hourStartPart,
    +minuteStartPart
  ).plus({ days: day });
  return startTimeDate;
}
