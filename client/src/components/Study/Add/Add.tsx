import { DateTime } from "luxon";
import * as React from "react";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";

import {
  CreateStudyMutationVariables,
  LessonGFragment,
  StudiesDocument,
  StudiesQuery,
  StudiesQueryVariables,
  useCreateStudyMutation,
} from "../../../generated/graphql";
import {
  generateError,
  generateValidateError,
} from "../../../helper/generateMessage";
import validate from "../../../helper/validate";
import Context from "../../Context";
import { KeysMatching } from "../../myTypes";
import messageBox from "../messageBox";
import schema from "../schema";
import ClassesForm from "./ClassesForm";
import DateForm from "./DateForm";
import LessonForm from "./LessonForm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      padding: theme.spacing(0, 1, 0, 1),
    },
  })
);

type PropsType = {
  setOpen(): void;
  initialValues: CreateStudyMutationVariables;
  setValues(value: CreateStudyMutationVariables): void;
  intersection: Array<any>;
  week: number;
};
function getSteps() {
  return ["Görünürlük", "İzin verilen sınıflar", "Tarih", "Etüt"];
}
type StepProps = {
  step: number;
  variables: CreateStudyMutationVariables;
  handleChange: (
    name: keyof CreateStudyMutationVariables
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  errors: KeysMatching<CreateStudyMutationVariables>;
  setVariables(value: CreateStudyMutationVariables): void;
};
function StepContent(props: StepProps) {
  const { step, variables, handleChange, errors, setVariables } = props;
  switch (step) {
    case 0:
      return (
        <>
          <FormControlLabel
            label="Öğrenciler etütü aramalarda görsün mü?"
            control={
              <Checkbox
                checked={!!variables.public}
                color="primary"
                onChange={handleChange("public")}
              />
            }
          />
          {errors.public && <FormHelperText>{errors.public}</FormHelperText>}
          <TextField
            value={variables.capacity || ""}
            disabled={!variables.public}
            type="number"
            variant="standard"
            label="Max Öğrenci sayısı"
            fullWidth
            helperText={errors.capacity}
            onChange={handleChange("capacity")}
          />
        </>
      );
    case 1:
      return (
        <ClassesForm
          variables={variables}
          setVariables={(values) => {
            setVariables({ ...variables, permissionClasses: values });
          }}
        />
      );
    case 2:
      return (
        <DateForm
          variables={variables}
          setVariables={(value) => setVariables({ ...variables, date: value })}
          errors={errors}
          handleChange={handleChange}
        />
      );
    case 3:
      return (
        <LessonForm
          variables={variables}
          errors={errors}
          handleChange={handleChange}
        />
      );
    default:
      return <span>Hata oluştu</span>;
  }
}
export default function AddAbsence(props: PropsType) {
  const {
    setOpen,
    setValues: setVariables,
    initialValues: variables,
    intersection,
    week,
  } = props;
  const classes = useStyles();
  const { setPr } = React.useContext(Context);
  const theme = useTheme<Theme>();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [errors, setErrors] = React.useState<
    KeysMatching<CreateStudyMutationVariables>
  >({});
  const [lesson] = React.useState<LessonGFragment | undefined>();

  const [createStudy, { loading }] = useCreateStudyMutation({
    onError: (error) => {
      generateError(error, setPr, messageBox);
      setActiveStep(-1);
    },
    onCompleted: () => {
      handleNext();
      setTimeout(function () {
        setOpen();
      }, 1000);
    },
  });

  const handleChange = (name: keyof CreateStudyMutationVariables) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value;
    switch (name) {
      case "public":
        value = event.currentTarget.checked;
        break;
      case "capacity":
        value = event.currentTarget.valueAsNumber || undefined;
        break;
      case "duration":
        value = event.currentTarget.valueAsNumber || undefined;
        break;
      default:
        value = event.currentTarget.value || undefined;
        break;
    }
    setVariables({
      ...variables,
      [name]: value,
    });
  };
  const handleNext = () => {
    if (activeStep !== steps.length) {
      if (checkIntersection()) {
        return;
      }
      if (activeStep === 0 && !variables.public)
        setActiveStep((prevActiveStep) => prevActiveStep + 2);
      else setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  function checkIntersection() {
    return activeStep === 2 && intersection.length > 0;
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleCreateStudy = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newStudy: CreateStudyMutationVariables = {
      ...variables,
      permissionClasses: variables.public
        ? variables.permissionClasses || []
        : undefined,
      lessonId: lesson ? lesson._id : undefined,
      date: DateTime.fromISO(variables.date)
        .setZone("UTC", { keepLocalTime: true })
        .toString(),
    };
    const validateErrors = validate(newStudy, schema);
    validateErrors && generateValidateError(setPr, validateErrors);
    setErrors(validateErrors || {});
    !validateErrors &&
      createStudy({
        variables: newStudy,
        update: (proxy, result) => {
          if (result.data) {
            const studiesQuery = proxy.readQuery<
              StudiesQuery,
              StudiesQueryVariables
            >({
              query: StudiesDocument,
              variables: { week },
            });
            if (studiesQuery) {
              const { studies } = studiesQuery;
              proxy.writeQuery<StudiesQuery, StudiesQueryVariables>({
                query: StudiesDocument,
                data: { studies: [...studies, result.data.createStudy] },
                variables: { week },
              });
              proxy.writeQuery<StudiesQuery, StudiesQueryVariables>({
                query: StudiesDocument,
                data: { studies: [...studies, result.data.createStudy] },
              });
            }
          }
        },
      });
  };
  return (
    <>
      {loading && <LinearProgress />}
      <Stepper
        activeStep={activeStep}
        orientation={fullScreen ? "vertical" : "horizontal"}
      >
        {steps.map((label) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <form onSubmit={handleCreateStudy} className={classes.form}>
        {activeStep === steps.length ? (
          <>Etüt kayıt edildi</>
        ) : (
          <StepContent
            variables={variables}
            handleChange={handleChange}
            errors={errors}
            step={activeStep}
            setVariables={setVariables}
          />
        )}
        {checkIntersection() && (
          <Typography color="error" variant="caption" component="p">
            {`Bu zaman aralığında ${intersection.length} tane dersiniz var`}
          </Typography>
        )}
        {activeStep !== steps.length && (
          <Box display="flex" justifyContent="flex-end" marginTop={1}>
            <Button onClick={setOpen}>İPTAL</Button>
            {activeStep !== 0 && (
              <Button color="primary" onClick={handleBack}>
                GERİ
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={loading}
              >
                OLUŞTUR
              </Button>
            ) : (
              <Button color="primary" variant="contained" onClick={handleNext}>
                İLERİ
              </Button>
            )}
          </Box>
        )}
      </form>
    </>
  );
}
