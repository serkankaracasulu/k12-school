import { DateTime } from "luxon";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Business as SchoolIcon,
  Class as ClassIcon,
  Loop as ReplayIcon,
  Schedule as ScheduleIcon,
} from "@material-ui/icons";

import { EventItemDetail } from "../../../myTypes";

type PropsType = {
  values: EventItemDetail;
  setOpen(): void;
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightButton: {
      marginLeft: theme.spacing(1),
    },
    select: {
      marginBottom: theme.spacing(1),
    },
    closeButton: {
      color: theme.palette.grey[500],
    },
    dialog: {
      padding: theme.spacing(1),
    },
    dialogMenu: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      "& > *": {
        marginRight: theme.spacing(1),
      },
    },
    info: {
      display: "flex",
      alignItems: "end",
      "& > *": {
        marginRight: theme.spacing(1),
      },
    },
    icon: {
      color: theme.palette.grey[700],
      marginRight: theme.spacing(2),
    },
  })
);
export default function EventDetail(props: PropsType) {
  const { values, setOpen } = props;
  const classes = useStyles();
  return (
    <Dialog onClose={setOpen} open className={classes.dialog}>
      <DialogTitle>{values.lessonName}</DialogTitle>
      <DialogContent>
        <div className={classes.info}>
          <Tooltip title="Her hafta tekrar eder">
            <ReplayIcon fontSize="small" color="primary" />
          </Tooltip>
          <Typography component="span" variant="body2">
            {DateTime.local()
              .startOf("week")
              .plus({ day: values.day })
              .toLocaleString({
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
          </Typography>
        </div>
      </DialogContent>
      <DialogContent>
        <div className={classes.info}>
          <ScheduleIcon color="primary" fontSize="small" />
          <Typography component="span" variant="body1">
            {values.start} - {values.finish}
          </Typography>
          <Typography component="span" variant="body2">
            {values.code} {". ders"}
          </Typography>
        </div>
      </DialogContent>
      <DialogContent>
        <div className={classes.info}>
          <SchoolIcon color="primary" fontSize="small" />
          <DialogContentText>{values.schoolName}</DialogContentText>
        </div>
        <div className={classes.info}>
          <ClassIcon color="primary" fontSize="small" />
          <DialogContentText>{values.className}</DialogContentText>
        </div>
      </DialogContent>
    </Dialog>
  );
}
