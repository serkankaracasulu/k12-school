import clsx from "clsx";
import { DateTime } from "luxon";
import * as React from "react";

import {
  Button,
  DialogActions,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  HourFragment,
  LessonFragment,
  SetExamMutationVariables,
  TermFragment,
  useSetExamMutation,
} from "../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../../helper/generateMessage";
import Context from "../../../../Context";
import DialogWrapper from "../../../../DialogW";
import messageBox from "./messageBox";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dayWrapper: {
      position: "relative",
    },
    day: {
      width: 36,
      height: 36,
      fontSize: theme.typography.caption.fontSize,
      margin: "0 2px",
      color: "inherit",
    },
    nonCurrentMonthDay: {
      color: theme.palette.text.disabled,
    },
    highlightNonCurrentMonthDay: {
      color: "#676767",
    },
    selectableDay: {
      backgroundColor: theme.palette.primary.light,
    },
    formControl: {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
    },
    box: {
      width: 20,
      height: 20,
      borderRadius: 4,
      display: "inline-block",
      margin: theme.spacing(1),
    },
    container: {
      display: "flex",
      alignItems: "center",
      margin: theme.spacing(1),
    },
  })
);

type PropsType = {
  setOpen(): void;
  lesson: LessonFragment;
  hours: HourFragment[];
  terms: TermFragment[];
  refetch(): Promise<any>;
  editVariables?: SetExamMutationVariables;
};
export default function SendExam(props: PropsType) {
  const { setOpen, lesson, hours, refetch, editVariables } = props;
  const classes = useStyles();
  const { setPr } = React.useContext(Context);
  const [variables, setVariables] = React.useState<SetExamMutationVariables>(
    editVariables || {
      lessonId: lesson._id,
      date: new Date(Date.now()).toISOString(),
      lessonHourCode: [],
    }
  );
  const [selectableHours, setSelectableHours] = React.useState(
    new Set<number>()
  );
  const [setExam] = useSetExamMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      refetch();
      setOpen();
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const handleChangeDate = (date: string) => {
    if (date) {
      const datetime = DateTime.fromISO(date);
      const lessonWeeklySchedules = lesson.lessonWeeklySchedules.filter(
        (lw) => lw.day === datetime.weekday - 1
      );
      setSelectableHours(
        new Set<number>(lessonWeeklySchedules.map((lw) => lw.hourCode))
      );
      setVariables({
        ...variables,
        date: datetime.toJSDate().toISOString(),
      });
    }
  };

  const handleHourChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    setVariables({
      ...variables,
      lessonHourCode: event.target.value as number[],
    });
  };

  const handleSetExam = () => {
    setExam({ variables });
  };
  return (
    <DialogWrapper
      setOpen={setOpen}
      title={editVariables ? "Sınavı Düzenle" : "Sınav Oluştur"}
      maxWidth="sm"
    >
      <FormGroup className={classes.formControl}>
        <InputLabel id="lesson-HourCode">Sınav tarihi</InputLabel>

        <TextField
          type="date"
          variant="standard"
          fullWidth
          value={DateTime.fromISO(variables.date).toFormat("yyyy-MM-dd")}
          onChange={(e) => handleChangeDate(e.target.value)}
        />
      </FormGroup>

      <FormControl
        className={classes.formControl}
        fullWidth
        style={{ paddingRight: "16px" }}
      >
        <InputLabel id="lesson-HourCode">Ders saati</InputLabel>
        <Select
          labelId="lesson-HourCode"
          id="lessonHourCode"
          value={variables.lessonHourCode}
          multiple
          onChange={handleHourChange}
        >
          {hours.map((hour) => (
            <MenuItem
              key={hour._id}
              value={hour.code}
              className={
                selectableHours.has(hour.code)
                  ? classes.selectableDay
                  : undefined
              }
            >
              {hour.code}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={classes.container}>
        <div className={clsx(classes.selectableDay, classes.box)} />
        <Typography variant="caption">Dersin olduğu saatler</Typography>
      </div>
      <DialogActions>
        <Button onClick={setOpen}>İptal</Button>
        <Button variant="contained" color="primary" onClick={handleSetExam}>
          Kaydet
        </Button>
      </DialogActions>
    </DialogWrapper>
  );
}
