import * as React from "react";

import { Button, Stepper, Typography } from "@material-ui/core";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { CreateVoyageMutationVariables } from "../../../../../generated/graphql";
import CreateButton from "./CreateButton";
import InstitutionSelect from "./InstitutionSelect";
import SchoolSelect from "./SchoolSelect";
import Title from "./Title";
import VoyageCreateItems from "./Voyages";

function getSteps() {
  return [
    "Kurum seçiniz",
    "Okul seçiniz",
    "Seferler için başlık giriniz",
    "Sefer ekleyiniz",
  ];
}
function getStepContent(
  step: number,
  set: React.Dispatch<React.SetStateAction<CreateVoyageMutationVariables>>,
  variables: CreateVoyageMutationVariables
) {
  switch (step) {
    case 0:
      return (
        <InstitutionSelect
          institutionId={variables.institutionId}
          setVar={(institutionId) =>
            set((v) => {
              return { ...v, institutionId };
            })
          }
        />
      );
    case 1:
      return (
        <SchoolSelect
          schoolId={variables.schoolId}
          institutionId={variables.institutionId}
          setVar={(schoolId) =>
            set((v) => {
              return { ...v, schoolId };
            })
          }
        />
      );
    case 2:
      return (
        <Title
          title={variables.title}
          setVar={(title) =>
            set((v) => {
              return { ...v, title };
            })
          }
        />
      );
    case 3:
      return (
        <VoyageCreateItems
          times={variables.times}
          set={(times) =>
            set((v) => {
              return { ...v, times };
            })
          }
        />
      );
    default:
      return "Unknown step";
  }
}

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
    buttons: {
      marginTop: theme.spacing(1),
    },
  })
);
export default function VoyageCreate() {
  const classes = useStyles();
  const steps = getSteps();
  const [error, setError] = React.useState(false);
  const [variables, setVariables] = React.useState<
    CreateVoyageMutationVariables
  >({
    title: "",
    institutionId: "",
    times: [],
    schoolId: "",
  });
  console.log(variables);

  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = () => {
    const valid = isValidStep();
    if (valid) {
      console.log(valid);

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  console.log(activeStep);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  const isValidStep = () => {
    if (activeStep === 0 && variables.institutionId) return true;
    if (activeStep === 1 && variables.schoolId) return true;
    else if (activeStep === 2 && variables.title) return true;
    else if (activeStep === 3 && variables.times.length > 0) return true;
    return false;
  };
  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            {!error && (
              <Typography className={classes.instructions}>
                Servis oluşturuldu
              </Typography>
            )}
            <Button onClick={handleReset} className={classes.button}>
              Sıfırla
            </Button>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep, setVariables, variables)}
            <div className={classes.buttons}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                GERİ
              </Button>
              {activeStep === steps.length - 1 ? (
                <CreateButton
                  onClick={handleNext}
                  variables={variables}
                  disabled={!isValidStep()}
                  setError={setError}
                />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!isValidStep()}
                  onClick={handleNext}
                  className={classes.button}
                >
                  İleri
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
