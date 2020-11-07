import * as React from "react";
import { useTranslation } from "react-i18next";

import { Button, Grid, TextField } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { UseAutocompleteProps } from "@material-ui/lab";

import {
  CreateSchoolInput,
  SchoolGFragment,
  SchoolsDocument,
  SchoolsQuery,
  SchoolsQueryVariables,
  useCreateSchoolMutation,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import validate from "../../../../helper/validate";
import { SetSnackBarProp, Variant } from "../../../myTypes";
import messageBox from "./messageBox";
import SchoolKindSelect from "./SchoolKindSelect";
import schema from "./schoolSchema";

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginLeft: theme.spacing(1),
  },
  action: {
    marginTop: theme.spacing(2),
  },
}));

type PropsType = {
  isActive(): void;
  schools: SchoolsQuery["schools"];
  setSnackBarProp: SetSnackBarProp;
};

type OnChangeProp = UseAutocompleteProps<
  SchoolGFragment,
  false,
  undefined,
  undefined
>["onChange"];

export default function CreateSchool(props: PropsType) {
  const { isActive, schools, setSnackBarProp } = props;
  const { t } = useTranslation();
  const [createSchoolQuery] = useCreateSchoolMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [values, setValues] = React.useState<CreateSchoolInput>({
    name: "",
  });
  const handleChange = (name: string) => (event: any) => {
    if (name === "schoolKindId")
      setValues({ ...values, [name]: event ? event._id : undefined });
    else setValues({ ...values, [name]: event.currentTarget.value });
  };
  const onChangeSchoolG = (value: SchoolGFragment | null | undefined) => {
    setValues({ ...values, schoolKindId: value ? value._id : undefined });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const schoolExist = schools.find((school) => school.name === values.name);
    if (schoolExist) {
      setSnackBarProp({
        variant: messageBox.code100.variant as Variant,
        message: messageBox.code100.messagename,
        open: true,
      });
      return;
    }
    const error = validate(values, schema);
    if (error) {
      generateValidateError(setSnackBarProp, error);
      return;
    }
    createSchoolQuery({
      variables: values,
      update: (cache, data) => {
        if (!data || !data.data) return;
        const createSchool = data.data.createSchool;
        cache.writeQuery<SchoolsQuery, SchoolsQueryVariables>({
          query: SchoolsDocument,
          data: {
            schools: [createSchool, ...schools],
          },
        });
      },
      optimisticResponse: {
        createSchool: {
          __typename: "School",
          _id: Math.round(Math.random() * -20000).toString(),
          classes: [],
          eOkulCode: values.eOkulCode || "",
          headMaster: null,
          name: values.name,
          educationYears: [],
          studentCount: 0,
        },
      },
    });
    isActive();
  };
  const classes = useStyles();
  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          margin="none"
          required
          fullWidth
          onChange={handleChange("name")}
          label={t("name")}
          name="name"
          id="name"
          autoFocus
          data-testid="school-name"
        />
        <TextField
          variant="standard"
          margin="none"
          onChange={handleChange("eOkulCode")}
          fullWidth
          id="eOkulCode"
          data-testid="school-code"
          name="eOkulCode"
          label={t("eOkulCode")}
        />
        <SchoolKindSelect onChangeSchoolG={onChangeSchoolG} />
        <Grid justify="flex-end" container className={classes.action}>
          <Button variant="text" size="small" onClick={isActive}>
            İPTAL
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            className={classes.submit}
            aria-label="create school"
          >
            KAYDET
          </Button>
        </Grid>
      </form>
    </>
  );
}
