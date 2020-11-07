import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import * as React from "react";

import {
  Button,
  DialogActions,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  StudentFragment,
  useStudentsQuery,
} from "../../../../generated/graphql";
import Context from "../../../Context";
import DialogWrapper from "../../../DialogW";
import StudentAvatar from "../../dashboard/StudentAvatar";
import addAbsenceUse from "./mutate";
import { LessonAddPropsType } from "./type";

export default function AddAbsence(props: LessonAddPropsType) {
  const {
    setOpen,
    lesson,
    schoolId,
    classId,
    hourCode,
    existStudentIds,
  } = props;
  const { setPr } = React.useContext(Context);
  const addAbsence = addAbsenceUse(setPr);
  const studentInputRef = React.useRef<HTMLInputElement | null>(null);
  const { data: dataStudents, loading } = useStudentsQuery({
    variables: {
      schoolId,
      classId,
    },
  });
  const [values, setValues] = React.useState<StudentFragment[]>([]);
  return (
    <DialogWrapper
      setOpen={setOpen}
      title={lesson.name || lesson.lessonName || ""}
      loading={addAbsence.result.loading}
    >
      <Autocomplete
        options={dataStudents?.students || []}
        disableCloseOnSelect
        getOptionLabel={(option) => option.fullName}
        multiple
        loading={loading}
        value={values}
        getOptionDisabled={(option) => existStudentIds.includes(option._id)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Öğrenci"
            variant="outlined"
            fullWidth
            inputRef={studentInputRef}
          />
        )}
        onChange={(event, newValue) => {
          setValues(newValue);
        }}
        renderOption={(option) => {
          const matches = match(
            option.fullName,
            studentInputRef.current?.value || ""
          );
          const nameParts = parse(option.fullName, matches);
          const schoolNoMatches = match(
            option.schoolNo || "",
            studentInputRef.current?.value || ""
          );
          const schoolNoParts = parse(option.schoolNo || "", schoolNoMatches);
          return (
            <Grid container alignItems="center" key={option._id}>
              <Grid item>
                <StudentAvatar studentId={option._id} />
              </Grid>
              <Grid item xs>
                {nameParts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}

                <Typography variant="body2" color="textSecondary">
                  Okul No :
                  {schoolNoParts.map((part, index) => (
                    <span
                      key={index}
                      style={{ fontWeight: part.highlight ? 700 : 400 }}
                    >
                      {part.text}
                    </span>
                  ))}
                </Typography>
              </Grid>
            </Grid>
          );
        }}
      />
      <DialogActions>
        <Button onClick={setOpen}>İPTAL</Button>
        <Button
          color="primary"
          variant="contained"
          disabled={addAbsence.result.loading}
          onClick={() =>
            addAbsence.mutate({
              hourCode,
              lessonId: lesson._id,
              studentIds: values.map((value) => value._id),
            })
          }
        >
          ONAYLA
        </Button>
      </DialogActions>
    </DialogWrapper>
  );
}
