import clsx from "clsx";
import * as React from "react";

import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core/";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Add as AddIcon } from "@material-ui/icons";

import {
  LessonFragment,
  LessonScheduleInput,
  LessonsQuery,
  WeeklyHour,
  WeeklySchedule,
} from "../../../../../../../generated/graphql";
import days from "../../../../../../days";
import WSAdd from "./Add";
import WSDetail from "./Detail";
import { Edit } from "./flowTypes";

const useStyles = makeStyles((theme: Theme) => ({
  nonSelect: {
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    KhtmlUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
  },
  cell: {
    padding: 0,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
  lessonContent: {
    width: "100px",
    height: "47px",
    textTransform: "capitalize",
    lineHeight: "unset",
    "& span": {
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
  },
}));
type PropsType = {
  lessons: LessonsQuery["lessons"];
  hours: WeeklyHour;
  schoolId: string;
  classId: string;
};
export default function WeeklySchedulePage(props: PropsType) {
  const { lessons, hours, schoolId, classId } = props;
  const classes = useStyles();
  const schedule: {
    lesson: LessonFragment;
    schedule: WeeklySchedule;
  }[][] = days.map(() => new Array(hours.hour.length));
  lessons.forEach((l) => {
    l.lessonWeeklySchedules.forEach((s) => {
      schedule[s.day][s.hourCode] = {
        lesson: l,
        schedule: s,
      };
    });
  });

  const [variables, setVariables] = React.useState<LessonScheduleInput>({
    day: 0,
    hourCode: 0,
    lessonId: "",
  });

  const [open, setOpen] = React.useState(false);
  const [edit, setEdit] = React.useState<Edit | false>(false);
  const handleMouseOver = (day: number, hourCode: number) => {
    setVariables({ ...variables, day, hourCode });
  };
  const handleMouseLeave = () => {
    !open && setVariables({ ...variables, day: -1, hourCode: -1 });
  };
  const handleDetail = (day: number, hourCode: number) => {
    setEdit({
      schoolId,
      classId,
      lesson: schedule[day][hourCode].lesson,
      schedule: schedule[day][hourCode].schedule,
    });
  };

  return (
    <>
      <Table aria-label="Weekly schedule table">
        <TableHead>
          <TableRow>
            <TableCell />
            {hours.hour.map((h) => (
              <TableCell align="center" key={h._id}>
                {h.code}
                <Typography color="textSecondary" variant="body2">
                  {`${h.start} - ${h.finish}`}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {days.map((d, dayindex) => (
            <TableRow key={d}>
              <TableCell>{d}</TableCell>
              {hours.hour.map((h) => (
                <TableCell
                  align="center"
                  key={h._id}
                  className={clsx(classes.nonSelect, classes.cell)}
                  onMouseOver={() => handleMouseOver(dayindex, h.code)}
                  onMouseLeave={handleMouseLeave}
                  onFocus={() => handleMouseOver(dayindex, h.code)}
                >
                  {variables.day === dayindex &&
                  variables.hourCode === h.code &&
                  !schedule[dayindex][h.code] ? (
                    <Tooltip title="Ekle">
                      <IconButton onClick={() => setOpen(true)}>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    schedule[dayindex][h.code] && (
                      <Tooltip
                        title={
                          schedule[dayindex][h.code].lesson.lessonName ||
                          schedule[dayindex][h.code].lesson.name ||
                          ""
                        }
                      >
                        <Button
                          onClick={() => handleDetail(dayindex, h.code)}
                          className={classes.lessonContent}
                          variant="contained"
                          color="primary"
                        >
                          {schedule[dayindex][h.code].lesson.lessonName ||
                            schedule[dayindex][h.code].lesson.name}
                        </Button>
                      </Tooltip>
                    )
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {open && (
        <WSAdd
          lessons={lessons}
          scheduleInitialValue={variables}
          setOpen={() => setOpen(false)}
        />
      )}
      {edit && <WSDetail edit={edit} setOpen={() => setEdit(false)} />}
    </>
  );
}
