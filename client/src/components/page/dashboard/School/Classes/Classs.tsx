import * as React from "react";

import { Box, Button } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

import {
  CreateClassInput,
  SchoolDocument,
  SchoolQuery,
  SchoolQueryVariables,
  useCreateClassMutation,
  useSchoolQuery,
} from "../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../../helper/generateMessage";
import validate from "../../../../../helper/validate";
import { SnackBarProp } from "../../../../myTypes";
import SnackBar from "../../../../SnackBar";
import ClassForm from "./ClassFrom";
import messageBox from "./messageBox";
import schema from "./schema";

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    marginTop: theme.spacing(3),
  },
  minWidth: {
    minWidth: "150px",
  },
  button: {
    margin: theme.spacing(3, 0, 2, 1),
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));
type PropsType = {
  schoolId: string;
  values: CreateClassInput;
  setValues(variables: CreateClassInput): void;
  open(): void;
  setLoading(statu: boolean): void;
};

export default function Classs(props: PropsType) {
  const { values, setValues, open, setLoading, schoolId } = props;
  const schoolQuertResult = useSchoolQuery({
    variables: { id: schoolId },
  });
  const school = schoolQuertResult.data && schoolQuertResult.data.school;
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });

  const classes = useStyles();
  const [createClass, { loading }] = useCreateClassMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const variables = values;
    const error = validate(variables, schema);
    if (error) {
      generateValidateError(setSnackBarProp, error);
      return;
    }
    createClass({
      variables,
      update: (proxy, mutationResult) => {
        const { data } = mutationResult;
        if (data && schoolQuertResult.data) {
          proxy.writeQuery<SchoolQuery, SchoolQueryVariables>({
            query: SchoolDocument,
            variables: { id: schoolId },
            data: {
              school: {
                ...schoolQuertResult.data.school,
                classes: [
                  ...schoolQuertResult.data.school.classes,
                  { ...data.createClass },
                ],
              },
            },
          });
        }
      },
    });
  };
  React.useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  return (
    <>
      {school && (
        <ClassForm
          values={values}
          setValues={setValues}
          schoolKindId={school.schoolKindId}
        />
      )}
      <Box display="flex" justifyContent="flex-end">
        <Button className={classes.button} onClick={open}>
          İptal
        </Button>
        <div>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            className={classes.button}
          >
            Kaydet
          </Button>
        </div>
      </Box>
      {snackBarProp.open && (
        <SnackBar pr={snackBarProp} setPr={setSnackBarProp} />
      )}
    </>
  );
}
