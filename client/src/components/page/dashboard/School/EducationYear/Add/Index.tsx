import * as Joi from "joi";
import { DateTime } from "luxon";
import * as React from "react";

import { LinearProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Step, { StepProps } from "@material-ui/core/Step";
import StepLabel, { StepLabelProps } from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import {
  EducationYearInput,
  SchoolDocument,
  SchoolQuery,
  SchoolQueryVariables,
  TermInput,
  useEditEducationYearMutation,
} from "../../../../../../generated/graphql";
import {
  generateError,
  generateValidateError,
} from "../../../../../../helper/generateMessage";
import validate from "../../../../../../helper/validate";
import Context from "../../../../../Context";
import Complated from "./Complated";
import defaultValue from "./defaultEducationYear";
import DefaultPage from "./DefaultPage";
import messageBox from "./messageBox";
import EducationName from "./Name";
import { educationYearSchema, nameSchema, termSchema } from "./schema";
import Terms from "./Terms";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

function getSteps() {
  return ["Hazır dönem ayarla", "Eğitim Yılı", "Dönem ekle"];
}

type PropsType = {
  schoolId: string;
};

export default function (props: PropsType) {
  const { schoolId } = props;
  const classes = useStyles();
  const { setPr } = React.useContext(Context);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [name, setName] = React.useState<string>(
    `${DateTime.local().year} - ${
      DateTime.local().plus({ years: 1 }).year
    } Eğitim Öğretim Yılı`
  );
  const [term, setTerm] = React.useState<TermInput>({
    name: "",
    start: new Date(Date.now()).toISOString(),
    finish: new Date(Date.now()).toISOString(),
  });
  const [terms, setTerms] = React.useState<TermInput[]>([]);
  const [completed, setCompleted] = React.useState(new Set<number>());
  const [
    createEducationYear,
    { data, loading, error },
  ] = useEditEducationYearMutation({
    onError: (tError) => {
      generateError(tError, setPr, messageBox);
      setActiveStep(-1);
    },
  });
  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <DefaultPage />;
      case 1:
        return <EducationName name={name} setName={setName} />;
      case 2:
        return <Terms term={term} setTerm={setTerm} terms={terms} />;
      case 3:
        return <LinearProgress />;
      default:
        return "Başarısız";
    }
  }
  const handleAddTerm = () => {
    if (!terms.some((t) => t.name === term.name))
      if (handleValidate(term, termSchema)) setTerms([term, ...terms]);
  };
  const optionalStep = 0;
  const steps = getSteps();
  const isStepOptional = (step: number) => {
    return step === optionalStep;
  };
  const skippedSteps = () => {
    return skipped.size;
  };
  React.useEffect(() => {
    if (loading && activeStep !== 3) {
      setActiveStep(3);
    }
  }, [loading, activeStep]);
  const handleMutate = (variables: EducationYearInput) => {
    if (handleValidate(variables, educationYearSchema)) {
      if (!data && !loading && !error)
        createEducationYear({
          variables,
          update: (proxy, result) => {
            if (result.data && result.data.editEducationYear) {
              const { editEducationYear } = result.data;
              const schoolQuery = proxy.readQuery<
                SchoolQuery,
                SchoolQueryVariables
              >({ query: SchoolDocument, variables: { id: schoolId } });
              if (schoolQuery && schoolQuery.school) {
                const { school } = schoolQuery;
                proxy.writeQuery<SchoolQuery, SchoolQueryVariables>({
                  query: SchoolDocument,
                  variables: { id: schoolId },
                  data: {
                    school: {
                      ...school,
                      educationYears: [
                        editEducationYear,
                        ...school.educationYears,
                      ],
                    },
                  },
                });
              }
            }
          },
        });
      return true;
    }
    return false;
  };
  const handleComplete = () => {
    if (isStepName() && !handleValidate({ name }, nameSchema)) return;
    if (isStepTerm()) {
      if (handleMutate({ name, terms, schoolId })) return;
    }
    if (isStepOptional(activeStep)) {
      if (handleMutate({ ...defaultValue, schoolId })) return;
    }
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);
    if (completed.size !== totalSteps() - skippedSteps()) {
      handleNext();
    }
  };
  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };
  const isStepName = () => {
    return activeStep === 1;
  };
  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };
  const isStepTerm = () => {
    return activeStep === 2;
  };
  const totalSteps = () => {
    return getSteps().length;
  };
  const allStepsCompleted = () => {
    return Boolean(data);
  };
  const completedSteps = () => {
    return completed.size;
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleValidate = (variables: any, vSchema: Joi.ObjectSchema) => {
    const validateError = validate(variables, vSchema);
    if (validateError) {
      generateValidateError(setPr, validateError);
      return false;
    }
    return true;
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: StepProps = {};
          const labelProps: StepLabelProps = { children: "" };
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Seçmeli</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <div>
        {allStepsCompleted() ? (
          <Complated />
        ) : (
          <div>
            {getStepContent(activeStep)}
            <div className={classes.instructions} />
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                GERİ
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  GEÇ
                </Button>
              )}
              {isStepTerm() && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddTerm}
                  className={classes.button}
                >
                  DÖNEM EKLE
                </Button>
              )}
              {activeStep !== steps.length &&
                !(terms.length === 0 && isStepTerm()) && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleComplete}
                  >
                    {completedSteps() + skippedSteps() === totalSteps() - 1 &&
                    terms.length > 0 &&
                    isLastStep()
                      ? "BİTİR"
                      : completed.has(activeStep)
                      ? "DEĞİŞTİR"
                      : "ONAYLA"}
                  </Button>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
