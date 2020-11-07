import * as React from "react";

import {
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  Book as BookIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Today as TodayIcon,
} from "@material-ui/icons";

import days from "../../../../../../days";
import { Edit } from "./flowTypes";
import Remove from "./Remove";

type PropsType = {
  edit: Edit;
  setOpen(): void;
};
const useStyles = makeStyles((theme) => ({
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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  icon: {
    color: theme.palette.grey[700],
    marginRight: theme.spacing(2),
  },
}));
export default function WeeklyScheduleDetail(props: PropsType) {
  const { edit, setOpen } = props;
  const classes = useStyles();
  const [openRemove, setOpenRemove] = React.useState(false);
  return (
    <Dialog onClose={setOpen} open className={classes.dialog}>
      <div className={classes.dialogMenu}>
        <Tooltip title="Kaldır">
          <IconButton
            aria-label="close"
            size="small"
            className={classes.closeButton}
            onClick={() => setOpenRemove(true)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Kapat">
          <IconButton
            aria-label="close"
            size="small"
            className={classes.closeButton}
            onClick={setOpen}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>
      <DialogContent>
        <div className={classes.info}>
          <BookIcon className={classes.icon} />

          <Typography component="span" variant="body1">
            {edit.lesson.name || edit.lesson.lessonName}
          </Typography>
        </div>
        <div className={classes.info}>
          <PersonIcon className={classes.icon} />
          <Typography component="span" variant="body1">
            {edit.lesson.teacher
              ? `${edit.lesson.teacher.firstName} ${edit.lesson.teacher.lastName}`
              : "(Öğretmen seçilmedi)"}
          </Typography>
        </div>
        <div className={classes.info}>
          <TodayIcon className={classes.icon} />
          <Typography component="span" variant="body1">
            {`${days[edit.schedule.day]}, ${edit.schedule.hourCode}. ders`}
          </Typography>
        </div>
      </DialogContent>
      <Remove
        variables={edit}
        open={openRemove}
        setOpen={() => setOpenRemove(false)}
        setCloseDetail={setOpen}
      />
    </Dialog>
  );
}
