import * as React from "react";

import Button from "@material-ui/core/Button";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import {
  UpdateStudentAddressMutationVariables,
  useUpdateStudentAddressMutation,
} from "../../generated/graphql";
import Context from "../Context";
import UserMapTitleEdit from "./EditTitle";
import MapPage from "./MapPage";
import { UserMapEditProps } from "./type";

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
  return ["Haritadan konum seçiniz", "Başlık ve tanım giriniz"];
}

function getStepContent(
  step: number,
  setVariables: UserMapEditProps["setVariables"],
  variables: UserMapEditProps["variables"]
) {
  switch (step) {
    case 0:
      return <MapPage setVariables={setVariables} variables={variables} />;
    case 1:
      return (
        <UserMapTitleEdit setVariables={setVariables} variables={variables} />
      );
    default:
      return "Unknown step";
  }
}

export default function UserAddressEdit() {
  const classes = useStyles();
  const { studentIndex } = React.useContext(Context);
  const [variables, setVariables] = React.useState<
    UpdateStudentAddressMutationVariables
  >({
    title: "",
    description: "",
    lat: 0,
    lng: 0,
    i: studentIndex!,
  });
  const [activeStep, setActiveStep] = React.useState(0);
  const [mutate, { error, data }] = useUpdateStudentAddressMutation({
    onError: () => {},
  });
  const steps = getSteps();
  const handleMutate = () => {
    if (studentIndex) mutate({ variables: { ...variables, i: studentIndex } });
    window.location.reload(false);
  };
  const handleNext = () => {
    if (activeStep === steps.length - 1) handleMutate();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const isStepComplate = () => {
    if (activeStep === 0) return !!(variables.lat && variables.lat);
    else if (activeStep === 1)
      return !!(variables.description && variables.description);
    else return false;
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
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
      <div>
        {activeStep === steps.length ? (
          <div>
            {data && !error && (
              <Typography className={classes.instructions}>
                Adres kayıt edildi
              </Typography>
            )}
            <Button onClick={handleReset} className={classes.button}>
              Sıfırla
            </Button>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep, setVariables, variables)}
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Geri
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!isStepComplate()}
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Kaydet" : "İLERİ"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
