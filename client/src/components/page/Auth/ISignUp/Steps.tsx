import * as React from "react";
import { useTranslation } from "react-i18next";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Copyright from "../../../Copyright";
import MainAppBar from "../../pricing/MainAppBar";
import Info from "./Info";
import InstitutionSignUp from "./InstitutionSignUp";
import Pricing from "./Pricing";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
    },
    layout: {
      width: "auto",
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        width: 600,
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
    paper: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        padding: theme.spacing(3),
      },
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

const steps = ["Bilgilendirme", "Tarife", "Kayıt"];

export default function ISignUpStep() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Info />;
      case 1:
        return <Pricing />;
      case 2:
        return <InstitutionSignUp next={handleNext} back={handleBack} />;
      default:
        throw new Error("Unknown step");
    }
  };
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  return (
    <>
      <MainAppBar />
      <main className={classes.layout}>
        <Paper className={classes.paper} elevation={2}>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <>
            {activeStep === steps.length ? (
              <>
                <Typography variant="h5" gutterBottom>
                  Bizi seçtiğiniz için teşekkürler.
                </Typography>
                <Typography variant="subtitle1">
                  E-Posta adresinize üyeliğinizi onaylamanız için link
                  gönderdik.
                </Typography>
              </>
            ) : (
              <>
                {getStepContent(activeStep)}
                {activeStep < steps.length - 1 && (
                  <div className={classes.buttons}>
                    {activeStep !== 0 && (
                      <Button onClick={handleBack} className={classes.button}>
                        {t("button.back")}
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1
                        ? "Place order"
                        : t("button.next")}
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        </Paper>
        <Copyright />
      </main>
    </>
  );
}
