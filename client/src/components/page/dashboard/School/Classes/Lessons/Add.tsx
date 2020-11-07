import * as React from "react";

import {
  Button,
  Checkbox,
  DialogActions,
  FormControlLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Autocomplete, { AutocompleteProps } from "@material-ui/lab/Autocomplete";

import {
  LessonGFragment,
  LessonInput,
  LessonsDocument,
  LessonsInput,
  LessonsQuery,
  SchoolKindClassQuery,
  TeachersQuery,
  useAddLessonMutation,
  useLessonsGQuery,
  useSchoolKindClassLazyQuery,
  useTeachersQuery,
} from "../../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../../../helper/generateMessage";
import validate from "../../../../../../helper/validate";
import SchoolContext from "../../../../../Context";
import DialogWrapper from "../../../../../DialogW";
import messageBox from "./messageBox";
import schema from "./schema";

type PropsType = {
  schoolKindId?: string;
  level: number;
  editLessonData: LessonInput;
  educationYearId: string;
  close(): void;
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    right: {
      display: "flex",
      justifyContent: "flex-end",
      marginLeft: theme.spacing(1),
    },
    selectForm: {
      // display: "flex",
      marginTop: theme.spacing(1),
    },
    select: {
      flexGrow: 1,
    },
    rightButton: {
      marginLeft: theme.spacing(1),
    },
    textField: {
      marginTop: theme.spacing(1),
      zIndex: 0,
    },
    selectRoot: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
    option: {
      zIndex: theme.zIndex.modal + 1,
    },
    skeletonText: {
      position: "absolute",
      bottom: 0,
      marginTop: theme.spacing(2),
    },
  })
);
export default function AddLessonForm(props: PropsType) {
  const { schoolKindId, level, editLessonData, educationYearId, close } = props;
  const [isOtherLesson, setIsOtherLesson] = React.useState(!schoolKindId);
  const [variables, setVariables] = React.useState<LessonInput>(editLessonData);
  const [classLesson, setClassLesson] = React.useState<
    SchoolKindClassQuery["schoolKindClass"]["lessons"][0] | null
  >(null);
  const [optionalName, setOptionalName] = React.useState(false);
  const [teacher, setTeacher] = React.useState<
    TeachersQuery["teachers"][0] | null
  >(null);
  const classes = useStyles();
  const { setPr } = React.useContext(SchoolContext);
  const [addLessonQuery] = useAddLessonMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const [editLesson, { loading: loadingAdd }] = useAddLessonMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const [
    get,
    { data: schoolKindClass, loading: loadingScholG },
  ] = useSchoolKindClassLazyQuery({
    onCompleted: (tData) => {
      const lessonItem = tData.schoolKindClass.lessons.find(
        (le) => le._id === variables.lessonId
      );
      if (lessonItem) {
        setClassLesson(lessonItem);
      }
    },
  });
  React.useEffect(() => {
    if (schoolKindId && !loadingScholG && !schoolKindClass) {
      get({ variables: { schoolGId: schoolKindId, level } });
    }
  });
  const { data: lessonData, loading } = useLessonsGQuery({
    onCompleted: (tData) => {
      const defaultLesson = tData.lessonsG.find(
        (l) => l._id === variables.lessonId
      );
      const ids: string[] = [];
      if (defaultLesson) {
        defaultLesson.teacherFields.forEach((t) =>
          t.departments.forEach((d) => ids.push(d._id))
        );
        setLessonDepartments(ids);
        setLesson(defaultLesson);
      }
    },
  });

  const [isOtherTeachers, setIsOtherTeachers] = React.useState(false);
  const { loading: laodingTeachers, data: teachersData } = useTeachersQuery({
    onCompleted: (tData) => {
      const teacherItem = tData.teachers.find(
        (te) => te._id === variables.teacherId
      );
      if (teacherItem) {
        setTeacher(teacherItem);
      }
    },
  });
  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (name === "weeklyHour")
      setVariables({ ...variables, [name]: +event.currentTarget.value });
    else setVariables({ ...variables, [name]: event.currentTarget.value });
  };
  const [lessonDepartments, setLessonDepartments] = React.useState<string[]>(
    []
  );
  const handleTeacherChange: AutocompleteProps<
    TeachersQuery["teachers"][0],
    false,
    undefined,
    undefined
  >["onChange"] = (e, newValue) => {
    setTeacher(newValue);
    setVariables({
      ...variables,
      teacherId: newValue ? newValue._id : undefined,
    });
  };
  const [lesson, setLesson] = React.useState<LessonGFragment | null>(null);
  const handleLessonChange: AutocompleteProps<
    SchoolKindClassQuery["schoolKindClass"]["lessons"][0],
    false,
    undefined,
    undefined
  >["onChange"] = (e, newValue) => {
    setClassLesson(newValue);
    if (lessonData) {
      if (newValue && newValue.lessonId) {
        setVariables({
          ...variables,
          lessonId: newValue.lessonId,
          weeklyHour: newValue.count,
        });
        const ids: string[] = [];
        newValue.lesson?.teacherFields.forEach((t) =>
          t.departments.forEach((d) => ids.push(d._id))
        );
        setLessonDepartments(ids);
      } else {
        setVariables({
          ...variables,
          lessonId: undefined,
          weeklyHour: 1,
        });
        setLessonDepartments([]);
      }
    }
  };

  const handleOtherLessonChange: AutocompleteProps<
    LessonGFragment,
    false,
    undefined,
    undefined
  >["onChange"] = (e, newValue) => {
    setLesson(newValue);
    if (lessonData && newValue) {
      if (newValue) {
        const classLesson =
          schoolKindClass &&
          schoolKindClass.schoolKindClass.lessons.find(
            (l) => l.lessonId && l.lessonId === newValue._id
          );
        setVariables({
          ...variables,
          lessonId: newValue._id,
          weeklyHour: classLesson ? classLesson.count : 1,
        });
        const ids: string[] = [];
        newValue.teacherFields.forEach((t) =>
          t.departments.forEach((d) => ids.push(d._id))
        );
        setLessonDepartments(ids);
      } else {
        setVariables({
          ...variables,
          lessonId: "",
          weeklyHour: 1,
        });
        setLessonDepartments([]);
      }
    }
  };
  const handleAddLesson = () => {
    const validateError = validate(variables, schema);
    console.log(variables);

    if (validateError) {
      generateValidateError(setPr, validateError);
      return;
    }
    if (variables._id) editLesson({ variables });
    else
      addLessonQuery({
        variables,
        update: (cache, fetchResult) => {
          if (fetchResult.data && fetchResult.data.addLesson) {
            const { addLesson } = fetchResult.data;
            const lessonsQuery = cache.readQuery<LessonsQuery, LessonsInput>({
              query: LessonsDocument,
              variables: {
                schoolId: variables.schoolId,
                classId: variables.classId,
                educationYearId,
              },
            });
            if (lessonsQuery) {
              const { lessons } = lessonsQuery;
              cache.writeQuery<LessonsQuery, LessonsInput>({
                query: LessonsDocument,
                variables: {
                  schoolId: variables.schoolId,
                  classId: variables.classId,
                  educationYearId,
                },
                data: { lessons: [...lessons, addLesson] },
              });
            }
            close();
          }
        },
      });
    close();
  };
  return (
    <DialogWrapper
      title="Ders ekle"
      setOpen={close}
      maxWidth="sm"
      loading={loadingAdd}
    >
      <div className={classes.selectForm}>
        {isOtherLesson && lessonData && (
          <Autocomplete
            options={lessonData.lessonsG}
            getOptionLabel={(option) => option.name}
            loading={loading}
            defaultValue={lessonData.lessonsG.find(
              (le) => le._id === variables.lessonId
            )}
            multiple={false}
            value={lesson}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Ders"
                fullWidth
              />
            )}
            classes={{
              root: classes.selectRoot,
              popupIndicator: classes.option,
            }}
            onChange={handleOtherLessonChange}
          />
        )}
        {!isOtherLesson && schoolKindClass && (
          <Autocomplete
            options={schoolKindClass.schoolKindClass.lessons}
            groupBy={(option) => (option.required ? "Zorunlu" : "Seçmeli")}
            getOptionLabel={(option) =>
              option.lesson ? option.lesson.name : "(Silinmiş ders)"
            }
            multiple={false}
            loading={laodingTeachers}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Ders"
                fullWidth
              />
            )}
            value={classLesson || undefined}
            classes={{
              root: classes.selectRoot,
              popupIndicator: classes.option,
            }}
            onChange={handleLessonChange}
          />
        )}

        <FormControlLabel
          control={
            <Checkbox
              disabled={!schoolKindId}
              checked={isOtherLesson}
              onChange={() => setIsOtherLesson(!isOtherLesson)}
              color="primary"
            />
          }
          labelPlacement="end"
          className={classes.right}
          label="Diğer dersler"
        />
      </div>
      <div className={classes.selectForm}>
        {teachersData && (
          <Autocomplete
            defaultValue={teachersData.teachers.find(
              (te) => te._id === variables.teacherId
            )}
            options={teachersData.teachers}
            getOptionLabel={(option) => option.fullName}
            loading={laodingTeachers}
            getOptionDisabled={(option) => {
              if (isOtherTeachers) return false;
              if (option.educations) {
                return !option.educations.some((e) =>
                  lessonDepartments.some(
                    (l) => e.department && l === e.department._id
                  )
                );
              }
              return true;
            }}
            onChange={handleTeacherChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Öğretmenler"
                fullWidth
              />
            )}
            value={teacher}
            classes={{
              root: classes.selectRoot,
              popupIndicator: classes.option,
            }}
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={isOtherTeachers}
              onChange={() => setIsOtherTeachers((o) => !o)}
              color="primary"
            />
          }
          labelPlacement="end"
          className={classes.right}
          label="Alan dışı"
        />
      </div>
      <TextField
        type="number"
        fullWidth
        variant="outlined"
        label="Haftalık saat"
        className={classes.textField}
        value={variables.weeklyHour}
        onChange={handleChange("weeklyHour")}
      />
      {optionalName && (
        <TextField
          fullWidth
          label="Ders Adı"
          variant="outlined"
          value={variables.name || ""}
          className={classes.textField}
          onChange={handleChange("name")}
        />
      )}
      <FormControlLabel
        control={
          <Checkbox
            value={optionalName}
            onChange={() => setOptionalName((o) => !o)}
            color="primary"
          />
        }
        label="Farklı ad girmek istiyorum"
      />
      <DialogActions>
        <Button onClick={close}>İPTAL</Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.rightButton}
          onClick={handleAddLesson}
          disabled={loadingAdd}
        >
          Kaydet
        </Button>
      </DialogActions>
      <Typography color="textSecondary" variant="body2">
        * Hazır tanımlı dersi seçiniz veya başka bir ad giriniz
      </Typography>
      <Typography
        color="textSecondary"
        variant="body2"
        aria-describedby="lessonBenefit"
      >
        * Hazır tanımlı dersi seçmek bir takım kolaylıklar sağlıyacaktır
      </Typography>
    </DialogWrapper>
  );
}
