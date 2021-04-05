import React, { useCallback } from "react";
import { useState, useEffect } from "react";
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

import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const ADD_ORDER = gql`
  mutation AddOrder($addData: orders_insert_input!) {
    insert_orders(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const ADD_ITEMS = gql`
  mutation AddItems($addData: items_insert_input!) {
    insert_items(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

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

export default function OrderData({ open, onSubmit, orderData, onChange }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  // const [open, setOpen] = useState(false);

  const [AddOrder, { data, loading, error }] = useMutation(ADD_ORDER);
  const [AddItems] = useMutation(ADD_ITEMS);

  useEffect(() => {
    console.log("additem");
    if (!loading && data) {
      console.log(orderData.items);
      let orderId = data.insert_orders.returning[0].id;
      orderData.items.forEach(function (item) {
        let obj = {
          order_id: orderId,
          note: item.note,
          item_id: item.item_id,
          qty: item.qty,
        };
        console.log(obj);
        AddItems({ variables: { addData: obj } });
      });
    }
  }, [loading, data, orderData, AddItems]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleAddOrder = () => {
    if (orderData.customer_id === undefined) {
      alert("Нужно выбрать заказчика");
      return false;
    } else if (orderData.items.length === 0) {
      alert("Нет позиций в заказе");
      return false;
    } else if (orderData.date_out === null) {
      alert("Нужно выбрать дату отгрузки");
      return false;
    } else {
      const preparedData = {
        date_out: orderData.date_out,
        customer_id: orderData.customer_id,
        firm_id: orderData.firm_id,
        person_id: orderData.person_id,
        shop_id: orderData.shop_id,
        our_firm_id: orderData.our_firm_id,
        delivery_id: orderData.deliveryData.delivery_id,
        city: orderData.deliveryData.city,
        packaging: orderData.packaging,
        consignee_name: orderData.deliveryData.consignee_name,
        consignee_phone: orderData.deliveryData.consignee_phone,
        consignee_data: orderData.deliveryData.consignee_data,
        note_delivery: orderData.deliveryData.note_delivery,
        price_type_id: orderData.price_type_id,
        discount: orderData.discount,
        pay_till_date: orderData.pay_till_date,
        payment_status: "не оплачен",
        sum: orderData.sum,
        weigth: orderData.orderParams.weigth,
        note_order: orderData.note_order,
        note_supplier: orderData.note_supplier,
      };
      console.log(preparedData);
      AddOrder({ variables: { addData: preparedData } });
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleAddOrder();
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // const handleEnd = () => {
  //   setActiveStep(0);
  //   setOpen(!open);
  // };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" color="primary" onClick={() => setOpen(!open)}>
        {open ? "Свернуть" : "Новый заказ"}
      </Button> */}
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
