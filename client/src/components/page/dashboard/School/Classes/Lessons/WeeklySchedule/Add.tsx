import * as pather from "path";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  DialogActions,
  IconButton,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Cancel as CancelIcon, Check as CheckIcon } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  LessonFragment,
  SetLessonScheduleMutationVariables,
  useSetLessonScheduleMutation,
} from "../../../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../../../../helper/generateMessage";
import validate from "../../../../../../../helper/validate";
import SchoolContext from "../../../../../../Context";
import DialogWrapper from "../../../../../../DialogW";
import messageBox from "./messageBox";
import schema from "./schema";

type PropsType = {
  lessons: LessonFragment[];
  scheduleInitialValue: SetLessonScheduleMutationVariables;
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
    selectRoot: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
    option: {
      zIndex: theme.zIndex.modal + 1,
    },
  })
);
export default function WeeklyScheduleAdd(props: PropsType) {
  const { lessons, scheduleInitialValue, setOpen } = props;
  const [variables, setVariables] = React.useState<
    SetLessonScheduleMutationVariables
  >(scheduleInitialValue);
  const [lesson, setLesson] = React.useState<LessonFragment | null>(null);
  const { setPr } = React.useContext(SchoolContext);
  const [setLessonSchedule, { loading }] = useSetLessonScheduleMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      setOpen();
    },
    onError: (cError) => {
      if (
        cError.graphQLErrors &&
        cError.graphQLErrors.length > 0 &&
        cError.graphQLErrors[0].extensions
      ) {
        const { code, exception } = cError.graphQLErrors[0].extensions;
        if (code === "400") {
          const message = (
            <span>
              <Typography variant="body2" component="span">
                Ders öğretmeni bu saatte
              </Typography>
              &nbsp;
              <Typography variant="body2" component="span">
                <b> {exception.schoolName}</b>
              </Typography>
              &nbsp;
              <Typography variant="body2" component="span">
                okulu
              </Typography>
              &nbsp;
              <Typography variant="body2">
                <b>{exception.className}</b>
              </Typography>
              &nbsp;
              <Typography variant="body2" component="span">
                sınıfı
              </Typography>
              &nbsp;
              {exception.schoolId && exception.classId && exception.lessonId ? (
                <Link
                  component={RouterLink}
                  to={pather.join(
                    "/myschools",
                    "schools",
                    exception.schoolId,
                    "classes",
                    exception.classId,
                    "lessons",
                    exception.lessonId
                  )}
                >
                  {exception.lessonName}
                </Link>
              ) : (
                exception.lessonName
              )}
              &nbsp;
              <Typography variant="body2" component="span">
                dersine giriyor
              </Typography>
            </span>
          );
          setPr({ message, variant: "error", open: true });
        } else generateError(cError, setPr, messageBox);
      }
      setOpen();
    },
  });
  const classes = useStyles();
  const handleChange = (e: any, newValue: LessonFragment | null) => {
    if (newValue) {
      setVariables({
        ...variables,
        lessonId: newValue._id,
      });
      setLesson(newValue);
    }
  };
  const handleSetSchedule = () => {
    if (lesson) {
      const validateError = validate(variables, schema);
      if (validateError) {
        generateValidateError(setPr, validateError);
        return;
      }
      setLessonSchedule({
        variables,
      });
    }
  };
  return (
    <DialogWrapper setOpen={setOpen} title="Haftalık Program" loading={loading}>
      <Autocomplete
        multiple={false}
        options={lessons}
        getOptionLabel={(option) => option.name || option.lessonName || ""}
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Ders" fullWidth />
        )}
        onChange={handleChange}
        getOptionDisabled={(option: LessonFragment) =>
          option.weeklyHour <= option.lessonWeeklySchedules.length
        }
        classes={{
          root: classes.selectRoot,
          popupIndicator: classes.option,
        }}
      />
      <div>
        <Typography color="textSecondary" variant="body2" component="span">
          {"Toplam saat : "}
        </Typography>
        {lesson && (
          <Typography component="span" variant="body1">
            {lesson.weeklyHour}
          </Typography>
        )}
      </div>
      <div>
        <Typography color="textSecondary" variant="body2" component="span">
          {"Seçilince kalan : "}
        </Typography>
        {lesson && (
          <Typography component="span" variant="body1">
            {lesson.weeklyHour - lesson.lessonWeeklySchedules.length - 1}
          </Typography>
        )}
      </div>
      <div>
        <Typography color="textSecondary" variant="body2" component="span">
          {"Öğretmen : "}
        </Typography>
        {lesson && (
          <Typography component="span" variant="body1">
            {lesson.teacher
              ? `${lesson.teacher.firstName} ${lesson.teacher.lastName}`
              : ""}
          </Typography>
        )}
      </div>
      <DialogActions>
        <IconButton onClick={setOpen}>
          <CancelIcon />
        </IconButton>
        <IconButton
          disabled={
            !(
              lesson &&
              lesson.weeklyHour - lesson.lessonWeeklySchedules.length - 1 >= 0
            ) || loading
          }
          className={classes.rightButton}
          color="primary"
          onClick={handleSetSchedule}
        >
          <CheckIcon />
        </IconButton>
      </DialogActions>
    </DialogWrapper>
  );
}
