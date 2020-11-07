import * as React from "react";
import { useTranslation } from "react-i18next";

import {
  Button,
  DialogContentText,
  Step,
  StepLabel,
  Stepper,
  useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";

import {
  CreateHoursMutationVariables,
  SchoolsDocument,
  SchoolsQuery,
  SchoolsQueryVariables,
  useCreateHoursMutation,
  useSchoolQuery,
  WeeklyHour,
} from "../../../../../generated/graphql";
import { generateHours } from "../../../../../helper/generateHours";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../../helper/generateMessage";
import validate from "../../../../../helper/validate";
import Loading from "../../../../Loading";
import { SetSnackBarProp } from "../../../../myTypes";
import { ValueType } from "./flowTypes";
import HoursForm from "./Hours";
import Options from "./Options";
import schema, { optionsSchema } from "./schema";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      margin: theme.spacing(1),
    },
    dialogContentText: {
      padding: theme.spacing(0, 1, 5, 1),
    },
    stepper: {
      padding: theme.spacing(3, 0, 5),
    },
    buttons: {
      display: "flex",
      justifyContent: "flex-end",
    },
    button: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(1),
    },
  })
);

const messageBox = {
  code100: {
    messageHour: "Bu saat adında başka kayıt var",
    messageDefault: "Varsayılan türde başka kayıt var",
    variant: "info",
  },
  code102: {
    messageiSchool: "Okul bulunmadı",
    messageHour: "Dönem bulunmadı",
    variant: "warning",
  },
  code103: { message: "Değişiklik olmadı", variant: "info" },
  codeBAD_USER_INPUT: { message: "Hatalı veri giriş", variant: "error" },
  success: { message: "Kayıt edildi.", variant: "success" },
  failed: { message: "Kayıt başarısız.", variant: "error" },
};

const steps = ["Bilgiler", "Ara ayarı"];
type PropsType = {
  setOpen(): void;
  schoolId: string;
  values?: WeeklyHour | null;
  setSnackBarProp: SetSnackBarProp;
};

export default function AddHour(props: PropsType) {
  const { setOpen, schoolId, setSnackBarProp, values } = props;
  const { data } = useSchoolQuery({
    variables: { id: schoolId },
  });
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [options, setOptions] = React.useState<ValueType>({
    hourCount: 9,
    breathingTime: 20,
    lessonTime: 40,
    startHour: "09:00",
    kind: values ? values.name : "Normal",
  });
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [
    variables,
    setVariables,
  ] = React.useState<CreateHoursMutationVariables | null>(null);
  const [createHourQuery, { loading }] = useCreateHoursMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (tError) => generateError(tError, setSnackBarProp, messageBox),
  });
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Options setValues={setOptions} values={options} />;
      case 1:
        if (variables)
          return (
            <HoursForm
              variables={variables}
              setVariables={setVariables}
              isEdit
            />
          );
        return "";
      default:
        throw new Error("Unknown step");
    }
  };
  const handleFinish = () => {
    if (variables) {
      const error = validate(variables, schema);
      if (error) {
        generateValidateError(setSnackBarProp, error);
        return;
      }
      createHourQuery({
        variables,
        update: (cache, createResult) => {
          if (!data) return;
          const createHour = createResult.data && createResult.data.createHour;
          if (!createHour) return;
          const schoolsQuery = cache.readQuery<
            SchoolsQuery,
            SchoolsQueryVariables
          >({
            query: SchoolsDocument,
          });
          if (!schoolsQuery) return;
          const restSchool = schoolsQuery.schools.filter(
            (sch) => sch._id !== data.school._id
          );
          const updatedSchool = {
            ...data.school,
            weeklyHour: createHour,
          };
          cache.writeQuery<SchoolsQuery, SchoolsQueryVariables>({
            query: SchoolsDocument,
            data: {
              schools: [updatedSchool, ...restSchool],
            },
          });
          setOpen();
        },
      });
    }
  };
  const handleNext = () => {
    const error = validate(options, optionsSchema);
    if (error) {
      generateValidateError(setSnackBarProp, error);
      return;
    }
    setVariables({
      hour: generateHours(
        options.hourCount,
        options.breathingTime,
        options.lessonTime,
        options.startHour
      ),
      schoolId,
      name: options.kind,
      _id: values ? values._id : undefined,
    });
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  return (
    <>
      {loading && <Loading />}
      <Stepper
        activeStep={activeStep}
        className={classes.stepper}
        orientation={fullScreen ? "vertical" : "horizontal"}
      >
        {steps.map((label) => {
          const labelProps = {};
          return (
            <Step key={label}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <DialogContentText
          color="primary"
          className={classes.dialogContentText}
          data-testid="hour-save-success"
        >
          {messageBox.success.message}
        </DialogContentText>
      ) : (
        <>
          {getStepContent(activeStep)}
          <div className={classes.buttons}>
            <Button onClick={setOpen} className={classes.button}>
              {t("button.cancel")}
            </Button>
            {activeStep !== 0 && (
              <Button onClick={handleBack} className={classes.button}>
                {t("button.back")}
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                aria-label="hour save"
                onClick={handleFinish}
                className={classes.button}
              >
                {t("button.save")}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                aria-label="next"
                onClick={handleNext}
                className={classes.button}
              >
                {t("button.next")}
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
}
