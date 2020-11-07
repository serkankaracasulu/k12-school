/* eslint-disable react/prop-types */
import MaterialTable from "material-table";
import * as React from "react";

import { Chip, Container, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  LessonsGQuery,
  LessonsGQueryVariables,
  useCreateLessonGMutation,
  useEditLessonGMutation,
  useLessonsGQuery,
  useRemoveLessonGMutation,
  useTeacherFieldsQuery,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import validate from "../../../../helper/validate";
import { SnackBarProp } from "../../../myTypes";
import SnackBar from "../../../SnackBar";
import schema from "./schema";
import { LessonsGDocument } from "./../../../../generated/graphql";

const messageBox = {
  success: { message: "Kayıt edildi.", variant: "success" },
  code100: {
    messageeOkulCode: "Bu E-Okul koduna sahip başka okul var",
    messagename: "Bu isme sahip başka okul var",
    variant: "info",
  },
  code102: {
    message: "Kayıt edilecek okul bulunamadı",
    messageHour: "Dönem bulunmadı",
    variant: "warning",
  },
  code103: { message: "Değişiklik olmadı", variant: "info" },
  codeBAD_USER_INPUT: { message: "Hatalı veri giriş", variant: "error" },
  failed: { message: "Kayıt başarısız.", variant: "error" },
};
const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    position: "relative",
  },
}));

export default function Index() {
  const classes = useStyles();
  const { data } = useLessonsGQuery();
  const queryTeacherField = useTeacherFieldsQuery();
  const lessons = data ? data.lessonsG : [];
  const [createLesson] = useCreateLessonGMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [removeLesson] = useRemoveLessonGMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [editLesson] = useEditLessonGMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  return (
    <Container maxWidth="lg" className={classes.container}>
      <MaterialTable
        title="Lesson"
        columns={[
          { title: "Name", field: "name" },
          {
            title: "Field",
            field: "teacherFields",
            render: (rowData) =>
              rowData.teacherFields.map((te) => (
                <Chip key={te._id} label={te.name} />
              )),
            // eslint-disable-next-line react/display-name
            editComponent: (props) => (
              <Autocomplete
                multiple
                options={
                  queryTeacherField.data
                    ? queryTeacherField.data.teacherFields
                    : []
                }
                getOptionLabel={(option) => option.name}
                defaultValue={props.rowData.teacherFields}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Teacher Field"
                    fullWidth
                  />
                )}
                onChange={(e, newValue) => props.onChange(newValue)}
              />
            ),
          },
        ]}
        data={lessons || []}
        editable={{
          onRowAdd: (newData) => {
            return new Promise((res, rej) => {
              const teacherFieldIds = newData.teacherFields
                ? newData.teacherFields.map((t) => t._id)
                : [];
              const variables = {
                name: newData.name,
                teacherFieldIds,
              };
              const validateError = validate(variables, schema);
              if (validateError) {
                generateValidateError(setSnackBarProp, validateError);
                rej();
              }
              return createLesson({
                variables,
                update: (cache, result) => {
                  const newLesson =
                    result && result.data && result.data.createLessonG;
                  newLesson &&
                    cache.writeQuery<LessonsGQuery, LessonsGQueryVariables>({
                      query: LessonsGDocument,
                      data: {
                        lessonsG: [newLesson, ...lessons],
                      },
                    });
                  res();
                },
              });
            });
          },
          onRowUpdate: (newData, oldData) => {
            return new Promise((res, rej) => {
              const { __typename, teacherFields: tFields, ...lesson } = newData;
              const teacherFieldIds = tFields.map((t) => t._id);
              const validateError = validate(lesson, schema);
              if (validateError) {
                generateValidateError(setSnackBarProp, validateError);
                rej();
              }
              return editLesson({
                variables: { ...lesson, teacherFieldIds },
                update: () => res(),
              });
            });
          },
          onRowDelete: (oldData) => {
            return new Promise((res, rej) => {
              return removeLesson({
                variables: { _id: oldData._id },
                update: (cache, result) => {
                  const removeId = result.data && result.data.removeLessonG._id;
                  if (removeId && lessons && data) {
                    const mLessons = data.lessonsG.filter(
                      (l) => l._id !== removeId
                    );
                    mLessons &&
                      cache.writeQuery<LessonsGQuery, LessonsGQueryVariables>({
                        query: LessonsGDocument,
                        data: { lessonsG: mLessons },
                      });
                  }
                  res();
                },
              });
            });
          },
        }}
      />
      {snackBarProp.open && (
        <SnackBar pr={snackBarProp} setPr={setSnackBarProp} />
      )}
    </Container>
  );
}
