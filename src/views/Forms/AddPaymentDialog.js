import React from "react";
import { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";

const ADD_PAYMENT = gql`
  mutation AddPaymentMutation($addData: documents_insert_input!) {
    insert_documents(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const QUERY_FIRMS = gql`
  query GetOrderData($customer_id: Int!) {
    firms(where: { customer_id: { _eq: $customer_id } }) {
      id
      name
    }
    our_firms {
      id
      name
    }
  }
`;

export default function AddPaymentDialog({
  open,
  onClose,
  customerId,
  orderId,
  firmId,
  ourFirmId,
}) {
  const [firms, setFirms] = useState({
    firms: [],
    ourFirms: [],
  });
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("sum" in fieldValues) temp.sum = fieldValues.sum ? 0 : "Обязательное поле";
    if ("date" in fieldValues) temp.date = fieldValues.date ? "" : "Обязательное поле";
    if ("our_firm_id" in fieldValues)
      temp.our_firm_id = fieldValues.our_firm_id ? "" : "Обязательное поле";
    if ("firm_id" in fieldValues) temp.firm_id = fieldValues.firm_id ? "" : "Обязательное поле";
    // if ("email" in fieldValues)
    //   temp.email = /$^|.+@.+..+/.test(fieldValues.email) ? "" : "Проверить написание Email";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  const initialValues = {
    sum: "",
    date: new Date(),
    number: 0,
    note: "",
    our_firm_id: ourFirmId,
    firm_id: firmId,
    debt_sum: 0,
  };
  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(
    initialValues,
    true,
    validate
  );
  const [AddPaymentMutation, { loading, error }] = useMutation(ADD_PAYMENT);
  const { loading: loadingFirms, error: errorFirms, data: dataFirms } = useQuery(QUERY_FIRMS, {
    variables: { customer_id: customerId },
  });

  useEffect(() => {
    if (dataFirms) {
      console.log(dataFirms);
      setFirms({
        firms: dataFirms.firms,
        ourFirms: dataFirms.our_firms,
      });
    }
  }, [dataFirms]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const addData = {
        date: values.date,
        sum: values.sum,
        firm_id: firmId,
        our_firm_id: ourFirmId,
        type_doc_id: 3, // constant money receipt
        number: values.number,
        note: values.note,
        year: values.date.getFullYear(),
        customer_id: customerId,
        shop_id: values.sum,
        sum_net: 0,
        order_id: orderId,
      };
      console.log(addData);
      AddPaymentMutation({ variables: { addData } });
      resetForm();
      onClose();
    }
  };

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  if (loadingFirms) return "Loading...";
  if (errorFirms) {
    // console.log(errorFirms);
    return `Error! ${errorFirms.message}`;
  }

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        // maxWidth="md"
        // minWidth="md"
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">Проводим платеж</DialogTitle>

        <DialogContent>
          <Form onSubmit={handleSubmit}>
            <Grid container>
              <Grid item xs={3}>
                <Controls.DateButtonPicker
                  name="date"
                  label="Дата"
                  value={values.date}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={8}>
                <Controls.Input
                  name="sum"
                  label="Сумма"
                  type="number"
                  value={values.sum}
                  onChange={handleInputChange}
                  error={errors.sum}
                />
              </Grid>
              <Grid item xs={8}>
                <Controls.Input
                  name="number"
                  label="Номер платежа"
                  type="number"
                  value={values.number}
                  onChange={handleInputChange}
                  error={errors.number}
                />
              </Grid>
              <Grid item xs={12}>
                <Controls.Select
                  name="firm_id"
                  label="Платеж от:"
                  value={values.firm_id}
                  onChange={handleInputChange}
                  options={firms.firms}
                  error={errors.firm_id}
                />
                <Controls.Select
                  name="our_firm_id"
                  label="Зачисляем на счет:"
                  value={values.our_firm_id}
                  onChange={handleInputChange}
                  options={firms.ourFirms}
                  error={errors.our_firm_id}
                />
                <Controls.Input
                  name="note"
                  label="Примечания"
                  value={values.note}
                  onChange={handleInputChange}
                  error={errors.note}
                />
                <pre>{JSON.stringify(values, null, 4)}</pre>
              </Grid>
            </Grid>
          </Form>
        </DialogContent>

        <DialogActions>
          <Controls.Button text="Отмена" color="default" onClick={handleCancel} />
          <Controls.Button type="submit" text="OK" onClick={handleSubmit} />
        </DialogActions>
      </Dialog>
    </>
  );
}
