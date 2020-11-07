import * as React from "react";
import { useTranslation } from "react-i18next";

import {
  Button,
  Chip,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";

import {
  SchoolsGDocument,
  SchoolsGQuery,
  SchoolsGQueryVariables,
  useCreateSchoolGMutation,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import validate from "../../../../helper/validate";
import { SetSnackBarProp } from "../../../myTypes";
import messageBox from "./messageBox";
import schema from "./schema";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      maxWidth: 300,
      marginTop: theme.spacing(1),
    },
    button: {
      margin: theme.spacing(3, 0, 2),
    },
    select: {
      minWidth: "100px",
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
  })
);

type PropsType = {
  isActive(): void;
  schools: SchoolsGQuery["schoolsG"];
  setSnackBarProp: SetSnackBarProp;
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name: number, cls: any[], theme: Theme) {
  return {
    fontWeight:
      cls.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const classesG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export default function CreateSchool(props: PropsType) {
  const { isActive, schools, setSnackBarProp } = props;
  const { t } = useTranslation();
  const [values, setValues] = React.useState<{
    name: string;
    classes: number[];
  }>({
    name: "",
    classes: [],
  });
  const [createSchool] = useCreateSchoolGMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (tError) => generateError(tError, setSnackBarProp, messageBox),
  });
  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };
  const theme = useTheme();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { classes, ...rest } = values;
    const classesArray: { level: number }[] = [];
    classes.forEach((c) => classesArray.push({ level: c }));
    const variables = { ...rest, classes: classesArray };
    const validateError = validate(variables, schema);
    if (validateError) {
      generateValidateError(setSnackBarProp, validateError);
      return;
    }
    createSchool({
      variables,
      update: (cache, createResult) => {
        const newSchool = createResult.data && createResult.data.createSchoolG;
        if (newSchool) {
          cache.writeQuery<SchoolsGQuery, SchoolsGQueryVariables>({
            query: SchoolsGDocument,
            data: { schoolsG: [newSchool, ...schools] },
          });
        }
      },
    });
    isActive();
  };
  const classes = useStyles();
  return (
    <>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          margin="none"
          required
          onChange={handleChange("name")}
          label={t("name")}
          name="name"
          id="name"
          fullWidth
          className={classes.formControl}
          autoFocus
          data-testid="school-name"
        />
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple-chip">Sınıflar</InputLabel>
          <Select
            multiple
            value={values.classes}
            onChange={(event) => {
              setValues({
                ...values,
                classes: event.target.value as number[],
              });
            }}
            input={<Input id="select-multiple-chip" />}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {classesG.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, values.classes, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid justify="flex-end" container>
          <Button
            variant="text"
            size="small"
            className={classes.button}
            onClick={isActive}
          >
            İPTAL
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            aria-label="create school"
          >
            KAYDET
          </Button>
        </Grid>
      </form>
    </>
  );
}
