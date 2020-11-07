/* eslint-disable react/display-name */
import MaterialTable from "material-table";
import * as React from "react";

import { Button, Container, TextField } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  ClassGFragment,
  LessonGFragment,
  SchoolsGQuery,
  useAddLessonToClassMutation,
  useClassGLazyQuery,
  useLessonsGQuery,
  useSchoolsGQuery,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import validate from "../../../../helper/validate";
import Dialog from "../../../DialogW";
import { SnackBarProp } from "../../../myTypes";
import SnackBar from "../../../SnackBar";
import CreataSchool from "./CreateSchool";
import DeleteLesson from "./DeleteLesson";
import messageBox from "./messageBox";
import { schemaAddLesson } from "./schema";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    position: "relative",
  },
  chip: {
    margin: 2,
  },
  button: {
    margin: theme.spacing(1),
  },
}));
type RemoveLessonToClassType = {
  schoolId: string;
  classId: string;
  _id: string;
};
export default function Index() {
  const classes = useStyles();
  const { data: dataSchoolgs, loading } = useSchoolsGQuery();
  const [
    getClass,
    { data: classData, loading: classLoading },
  ] = useClassGLazyQuery();
  const { data: lessonData } = useLessonsGQuery();
  const [addLessonToClass] = useAddLessonToClassMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (tError) => generateError(tError, setSnackBarProp, messageBox),
  });
  const [removeLesson, setRemoveLesson] = React.useState<{
    variables: RemoveLessonToClassType;
    label: { name: string; schoolName: string; className: number };
  } | null>(null);
  const [classs, setClass] = React.useState<{
    _id: string;
    name: string;
    classes?: ClassGFragment;
  }>({
    _id: "",
    name: "",
  });
  const handleSelectClass = (
    school: SchoolsGQuery["schoolsG"][0],
    clas: SchoolsGQuery["schoolsG"][0]["classes"][0]
  ) => {
    getClass({ variables: { classId: clas._id, schoolId: school._id } });
    if (classs._id === school._id && classs.classes) {
      if (classs.classes._id === clas._id) setClass({ _id: "", name: "" });
      else setClass({ _id: school._id, classes: clas, name: school.name });
    } else setClass({ _id: school._id, classes: clas, name: school.name });
  };
  const [lesson, setLesson] = React.useState<LessonGFragment | null>(null);
  const [create, setCreate] = React.useState<boolean>(false);
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Button onClick={() => setCreate(true)}>ekle</Button>
      <MaterialTable
        title="School"
        columns={[
          { title: "Name", field: "name" },
          {
            title: "Classes",
            field: "classes",
            render: (rowData) =>
              rowData.classes.map((cl) => (
                <Button
                  color="primary"
                  className={classes.button}
                  size="small"
                  variant={
                    classData && classData.classG._id === cl._id
                      ? "contained"
                      : "text"
                  }
                  onClick={() => handleSelectClass(rowData, cl)}
                  key={cl._id}
                >
                  {cl.level}
                </Button>
              )),
          },
        ]}
        isLoading={loading}
        data={dataSchoolgs?.schoolsG || []}
      />
      {classs.classes && (
        <MaterialTable
          title="Lesson"
          columns={[
            {
              title: "Name",
              field: "lessonId",
              render: (rowData) =>
                rowData.lesson ? rowData.lesson.name : "(Hata)",
              editComponent: (props) => (
                <Autocomplete
                  getOptionLabel={(option) => option.name}
                  value={lesson}
                  options={lessonData ? lessonData.lessonsG : []}
                  onChange={(e, newValue) => setLesson(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Ders"
                      fullWidth
                    />
                  )}
                />
              ),
            },
            {
              title: "Count",
              field: "count",
              type: "numeric",
            },
            {
              title: "Required",
              field: "required",
              type: "boolean",
            },
          ]}
          isLoading={classLoading}
          data={classData ? classData.classG.lessons : []}
          actions={[
            {
              icon: "delete",
              tooltip: "Remove lesson",
              onClick: (event, rowData) =>
                new Promise((res, rej) => {
                  if (classs.classes && !Array.isArray(rowData)) {
                    setRemoveLesson({
                      variables: {
                        schoolId: classs._id,
                        classId: classs.classes._id,
                        _id: rowData._id,
                      },
                      label: {
                        className: classs.classes.level,
                        schoolName: classs.name,
                        name: rowData.lesson ? rowData.lesson.name : "(Hata)",
                      },
                    });
                    res();
                  } else rej();
                }),
            },
          ]}
          editable={{
            onRowAdd: (newData) => {
              return new Promise((res, rej) => {
                const variables = {
                  schoolId: classs._id,
                  classId: classs.classes ? classs.classes._id : "",
                  lessonId: lesson ? lesson._id : "",
                  count: +newData.count || 1,
                  required: newData.required,
                };
                const validateError = validate(variables, schemaAddLesson);
                if (validateError) {
                  generateValidateError(setSnackBarProp, validateError);
                  rej();
                }
                return addLessonToClass({
                  variables,
                  update: () => res(),
                });
              });
            },
          }}
        />
      )}
      {create && (
        <Dialog setOpen={() => setCreate(false)} title="school">
          <CreataSchool
            isActive={() => setCreate(false)}
            schools={dataSchoolgs?.schoolsG || []}
            setSnackBarProp={setSnackBarProp}
          />
        </Dialog>
      )}
      {snackBarProp.open && (
        <SnackBar pr={snackBarProp} setPr={setSnackBarProp} />
      )}
      {removeLesson && (
        <DeleteLesson
          variables={removeLesson.variables}
          label={removeLesson.label}
          setRemove={() => setRemoveLesson(null)}
          setSnackBarProp={setSnackBarProp}
        />
      )}
    </Container>
  );
}
