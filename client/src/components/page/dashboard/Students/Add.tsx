import * as React from "react";

import {
  Button,
  DialogActions,
  TextField,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  AddStudentMutationVariables,
  SchoolQuery,
  StudentDocument,
  StudentQuery,
  StudentQueryVariables,
  StudentsDocument,
  StudentsQuery,
  StudentsQueryVariables,
  useAddStudentMutation,
  useSchoolsQuery,
  useStudentLazyQuery,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import imageToString from "../../../../helper/imageToString";
import validate from "../../../../helper/validate";
import SchoolContext from "../../../Context";
import DialogWrapper from "../../../DialogW";
import { KeysMatching } from "../../../myTypes";
import messageBox from "./messageBox";
import schema from "./schema";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightButton: {
      marginLeft: theme.spacing(1),
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
type PropsType = {
  setOpen(): void;
  student?: AddStudentMutationVariables;
  refetch?(variables?: StudentQueryVariables | undefined): Promise<any>;
};

export default function CreateStudent(props: PropsType) {
  const { setOpen, student, refetch } = props;
  const classes = useStyles();
  const { setPr } = React.useContext(SchoolContext);
  const [validateErrors, setValidateErrors] = React.useState<
    KeysMatching<AddStudentMutationVariables>
  >({});
  const { data, loading } = useSchoolsQuery();
  const [variables, setVariables] = React.useState<AddStudentMutationVariables>(
    student || { school: "", citizenshipId: "", firstName: "", lastName: "" }
  );
  const [
    checkStudent,
    { data: dataStudent, loading: loadingStudent },
  ] = useStudentLazyQuery();
  const [addStudent, { loading: loadingAdd }] = useAddStudentMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      if (refetch) refetch();
      setOpen();
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const getClass = () => {
    if (data) {
      const school = data.schools.find((sc) => sc._id === variables.school);
      if (school) return school.classes;
      return [];
    }
    return [];
  };
  const [selectedSchool, setSelectedSchool] = React.useState<
    SchoolQuery["school"] | null
  >(null);
  const [selectedClass, setSelectedClass] = React.useState<
    SchoolQuery["school"]["classes"][0] | null
  >(null);
  const handleChange = (name: keyof AddStudentMutationVariables) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVariables({
      ...variables,
      [name]: event.currentTarget.value || undefined,
    });
  };
  function imageRead(e: React.ChangeEvent<HTMLInputElement>) {
    imageToString(e, (result) =>
      setVariables({ ...variables, profilePhotoBase64: result })
    );
  }
  function isStudentExist() {
    if (
      dataStudent &&
      dataStudent.student.citizenshipId === variables.citizenshipId
    )
      return true;
    return false;
  }
  const handleCheckTC = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const citizenshipId = e.currentTarget.value;
    checkStudent({ variables: { citizenshipId } });
  };
  const handleAddStudent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (variables) {
      const validateError = validate(variables, schema);
      if (validateError) {
        setValidateErrors(validateError);
        generateValidateError(setPr, validateError);
        return;
      } else setValidateErrors({});
      addStudent({
        variables,
        update: (proxy, mResult) => {
          if (mResult.data) {
            const { addStudent } = mResult.data;
            if (student) {
              proxy.writeQuery<StudentQuery, StudentQueryVariables>({
                query: StudentDocument,
                data: { student: addStudent },
                variables: { studentId: addStudent._id },
              });
            } else {
              const variables = {
                schoolId: addStudent.school ? addStudent.school : undefined,
                classId: addStudent.class ? addStudent.class : undefined,
              };
              const studentsQuery = proxy.readQuery<
                StudentsQuery,
                StudentsQueryVariables
              >({
                query: StudentsDocument,
                variables,
              });
              if (studentsQuery) {
                proxy.writeQuery<StudentsQuery, StudentsQueryVariables>({
                  query: StudentsDocument,
                  data: {
                    students: [...studentsQuery.students, addStudent],
                  },
                  variables,
                });
              }
            }
          }
        },
      });
    }
  };
  return (
    <DialogWrapper setOpen={setOpen} title="Öğrenci" loading={loadingAdd}>
      <form onSubmit={handleAddStudent}>
        <TextField
          fullWidth
          label="Ad"
          variant="outlined"
          margin="normal"
          helperText={validateErrors.firstName}
          required
          value={variables.firstName}
          onChange={handleChange("firstName")}
        />
        <TextField
          fullWidth
          label="Soyad"
          variant="outlined"
          margin="normal"
          helperText={validateErrors.lastName}
          required
          value={variables.lastName}
          onChange={handleChange("lastName")}
        />
        <TextField
          fullWidth
          label="T.C. No"
          variant="outlined"
          margin="normal"
          helperText={
            validateErrors.citizenshipId ||
            (isStudentExist() && "Kurumunuzda bu T.C ile kayıtlı öğrenci var")
          }
          required
          disabled={!!student}
          value={variables.citizenshipId}
          onChange={handleChange("citizenshipId")}
          onBlur={handleCheckTC}
        />
        <TextField
          fullWidth
          label="Okul No"
          variant="outlined"
          margin="normal"
          helperText={validateErrors.schoolNo}
          value={variables.schoolNo || ""}
          onChange={handleChange("schoolNo")}
        />
        {!student && (
          <Autocomplete
            options={data ? data.schools : []}
            getOptionLabel={(option) => option.name}
            groupBy={(option) => option.schoolKindName || ""}
            classes={{
              root: classes.selectRoot,
            }}
            value={selectedSchool}
            onChange={(event, newValue) => {
              setVariables({
                ...variables,
                school: newValue?._id,
                class: undefined,
              });
              setSelectedSchool(newValue);
              setSelectedClass(null);
            }}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={validateErrors.school}
                label="Okul"
                variant="outlined"
                fullWidth
                autoComplete="off"
              />
            )}
          />
        )}
        {!student && (
          <Autocomplete
            options={getClass()}
            getOptionLabel={(option) =>
              `${option.level} ${option.code || ""} ${option.code1 || ""}`
            }
            classes={{
              root: classes.selectRoot,
            }}
            value={selectedClass}
            onChange={(event, newValue) => {
              setVariables({
                ...variables,
                class: newValue?._id,
              });
              setSelectedClass(newValue);
            }}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sınıf"
                variant="outlined"
                fullWidth
                helperText={validateErrors.class}
              />
            )}
          />
        )}
        <div>
          <Typography>Resim</Typography>
          <input type="file" accept="image/*" onChange={imageRead} />
        </div>

        <DialogActions>
          <Button onClick={setOpen}>İptal</Button>
          <Button
            className={classes.rightButton}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loadingAdd || isStudentExist() || loadingStudent}
          >
            Kaydet
          </Button>
        </DialogActions>
      </form>
    </DialogWrapper>
  );
}
