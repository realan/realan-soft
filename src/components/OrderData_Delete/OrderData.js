import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeliveryForm from "./DeliveryForm";
import SelectCustomer from "./SelectCustomer";
import PositionsForm from "./PositionsForm";
import DocumentsForm from "./DocumentsForm";
import SubmitButton from "./SubmitButton";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(800 + theme.spacing(2) * 2)]: {
      width: 800,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(800 + theme.spacing(3) * 2)]: {
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
}));

const steps = ["Заказчик", "Доставка", "Позиции", "Документы"];

function getStepContent(step, data, onChange) {
  switch (step) {
    case 0:
      return <SelectCustomer orderData={data} onChange={onChange} />;
    case 1:
      return <DeliveryForm orderData={data} onChange={onChange} />;
    case 2:
      return <PositionsForm orderData={data} onChange={onChange} />;
    case 3:
      return <DocumentsForm orderData={data} onChange={onChange} />;
    default:
      throw new Error("Unknown step");
  }
}

export default function OrderData({ onSubmit, orderData, onChange }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // submitAddOrder(orderData);
      // handleAddOrder();
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Новый заказ
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Заказ размещен.
                </Typography>
                <Typography variant="subtitle1">
                  Нужно сориентировать заказчика по дате отгрузки и выставить счет.
                  <Button variant="outlined" onClick={onSubmit}>
                    OK
                  </Button>
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep, orderData, onChange)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Назад
                    </Button>
                  )}
                  {activeStep !== steps.length - 1 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      Далее
                    </Button>
                  )}
                  {activeStep === steps.length - 1 && (
                    <SubmitButton orderData={orderData} nextStep={handleNext} />
                  )}
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
}