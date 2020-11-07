import * as React from "react";
import {
  FormControl,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useParams } from "react-router-dom";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { setClassroomTeacherSchema as schema } from "./schema";
import SchoolContext from "../../../../Context";
import messageBox from "./messageBox";
import validate from "../../../../../helper/validate";
import {
  generateValidateError,
  generateSuccess,
  generateError,
} from "../../../../../helper/generateMessage";

import { UseAutocompleteProps } from "@material-ui/lab";
import {
  useSchoolsQuery,
  useTeachersFullnameQuery,
  useSetClassroomTeacherMutation,
  SchoolQuery,
  SchoolQueryVariables,
  SchoolDocument,
  TeachersFullnameQuery,
} from "../../../../../generated/graphql";

type PropsType = { classId: string; setOpen(): void };
const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: "100%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    "& button": {
      marginLeft: theme.spacing(1),
    },
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
}));

type SetClassroomTeacherTvariablesType = {
  schoolId: string;
  classId: string;
  userId?: string;
};
type ParamType = {
  schoolId: string;
};
export default function SchoolKindSelect(props: PropsType) {
  const classes = useStyles();
  const { classId, setOpen } = props;
  const { schoolId } = useParams<ParamType>();
  const { setPr } = React.useContext(SchoolContext);
  const { data, loading } = useTeachersFullnameQuery();
  const { data: schoolsData } = useSchoolsQuery();
  const [variables, setVariables] = React.useState<
    SetClassroomTeacherTvariablesType
  >({
    schoolId,
    classId,
  });
  const [
    setClassroomTeacher,
    { loading: mutationLoading },
  ] = useSetClassroomTeacherMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      setOpen();
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const handleSetTeacher = () => {
    const validateError = validate(variables, schema);
    if (validateError) {
      generateValidateError(setPr, validateError);
      return;
    }
    setClassroomTeacher({
      variables,
      update: (cache, mutationResult) => {
        const { data: mutationData } = mutationResult;
        const schoolQuery = cache.readQuery<SchoolQuery, SchoolQueryVariables>({
          query: SchoolDocument,
          variables: { id: schoolId },
        });
        if (
          mutationData &&
          mutationData.setClassroomTeacher.success &&
          data &&
          schoolQuery
        ) {
          const teacher = data.teachers.find((t) => t._id === variables.userId);
          const editedClass = schoolQuery.school.classes.find(
            (c) => c._id === classId
          );
          if (editedClass) {
            const { school } = schoolQuery;
            const otherClasses = school.classes.filter(
              (c) => c._id !== classId
            );
            cache.writeQuery<SchoolQuery, SchoolQueryVariables>({
              query: SchoolDocument,
              variables: { id: schoolId },
              data: {
                school: {
                  ...school,
                  classes: [
                    {
                      ...editedClass,
                      classroomTeacher: teacher,
                    },
                    ...otherClasses,
                  ],
                },
              },
            });
          }
        }
      },
    });
  };
  const handleChange: UseAutocompleteProps<
    TeachersFullnameQuery["teachers"][0],
    false,
    undefined,
    undefined
  >["onChange"] = (e, newValue) => {
    if (newValue) {
      if (newValue) {
        setVariables({
          ...variables,
          userId: newValue._id,
        });
      } else {
        setVariables({ ...variables });
      }
    } else {
      setVariables({ ...variables });
    }
  };
  return (
    <>
      <FormControl fullWidth margin="dense">
        <Autocomplete
          options={data ? data.teachers : []}
          getOptionLabel={(option) => option.fullName}
          loading={loading}
          getOptionDisabled={(option) => {
            let disabled = false;
            schoolsData &&
              schoolsData.schools.forEach((s) => {
                const finded = s.classes.some((c) => {
                  if (c.classroomTeacher)
                    if (c.classroomTeacher._id === option._id) return true;
                  return false;
                });
                if (finded) disabled = true;
              });
            return disabled;
          }}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Sınıf Öğretmeni"
              fullWidth
            />
          )}
        />
      </FormControl>
      <Box
        display="flex"
        justifyContent="flex-end"
        className={classes.container}
      >
        <Button size="small" onClick={setOpen}>
          İptal
        </Button>
        <div className={classes.wrapper}>
          <Button
            variant="contained"
            color="primary"
            disabled={loading || mutationLoading}
            size="small"
            onClick={handleSetTeacher}
          >
            Kaydet
          </Button>
          {mutationLoading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </Box>
    </>
  );
}
