import React, { useCallback } from "react";
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

export default function Checkout() {
  const initialState = {
    customer_id: undefined,
    firm_id: undefined,
    shop_id: undefined,
    person_id: undefined,
    customer: { name: undefined },
  };

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState(initialState);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleEnd = () => {
    setActiveStep(0);
    setOpen(!open);
  };

  // const onOrderDataChange = (type, value) => {
  //   // console.log(type, value);
  //   console.log(orderData);
  //   setOrderData({...orderData, [type]: value })
  // }

  const onOrderDataChange = useCallback(
    (type, value) => {
      // console.log(type, value);
      console.log(orderData);
      setOrderData((prevState) => ({ ...prevState, [type]: value }));
      // debugger;
    },
    [orderData]
  );

  return (
    <React.Fragment>
      <Button variant="outlined" color="primary" onClick={() => setOpen(!open)}>
        {open ? "Свернуть" : "Новый заказ"}
      </Button>
      {open && (
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
                      <Button variant="outlined" onClick={handleEnd}>
                        OK
                      </Button>
                    </Typography>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {getStepContent(activeStep, orderData, onOrderDataChange)}
                    <div className={classes.buttons}>
                      {activeStep !== 0 && (
                        <Button onClick={handleBack} className={classes.button}>
                          Назад
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1 ? "Разместить заказ" : "Далее"}
                      </Button>
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            </Paper>
          </main>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
