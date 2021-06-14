import React from "react";
import { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, FormPop } from "../../components/useForm";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { QUERY_DELIVERY } from "./OrderProcessing/orderConstants";

const ADD_PAYMENT = gql`
  mutation AddPaymentMutation($addData: shops_insert_input!) {
    insert_shops(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const initialValues = {
  name: "",
  city: "",
  address: "",
  email: "",
  consignee_name: "",
  consignee_phone: "",
  consignee_data: "",
  delivery_note: "",
  delivery_id: undefined,
  delivery_ask: "",
};

export default function AddPaymentDialog({ customerId }) {
  const [delivery, setDelivery] = useState([]);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    // if ("name" in fieldValues) temp.name = fieldValues.name ? "" : "Обязательное поле";
    // if ("city" in fieldValues) temp.city = fieldValues.city ? "" : "Обязательное поле";
    // if ("email" in fieldValues)
    //   temp.email = /$^|.+@.+..+/.test(fieldValues.email) ? "" : "Проверить написание Email";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(
    initialValues,
    true,
    validate
  );
  const [AddPaymentMutation, { loading, error }] = useMutation(ADD_PAYMENT);
  const { loading: loadingDelivery, error: errorDelivery, data: dataDelivery } = useQuery(
    QUERY_DELIVERY
  );

  useEffect(() => {
    if (dataDelivery) {
      setDelivery(dataDelivery.delivery);
    }
  }, [dataDelivery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const addData = {
        ...values,
        ["delivery_id"]: Number(values.delivery_id),
        ["customer_id"]: customerId,
      };
      // console.log(addData);
      AddPaymentMutation({ variables: { addData } });
      resetForm();
    }
  };

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  if (loadingDelivery) return "Loading...";
  if (errorDelivery) return `Error! ${errorDelivery.message}`;

  return (
    <>
      <FormPop formName={"+ Магазин/Доставка"} onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            <Controls.Input
              name="name"
              label="Магазин (получатель)"
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
            />
            <Controls.Input
              name="city"
              label="Город"
              value={values.city}
              onChange={handleInputChange}
              error={errors.city}
            />
            <Controls.Select
              name="delivery_id"
              label="ТК"
              value={values.delivery_id}
              onChange={handleInputChange}
              options={delivery}
              error={errors.delivery_id}
            />
            <Controls.Input
              name="address"
              label="Адрес доставки или ПВЗ СДЭКа"
              value={values.address}
              onChange={handleInputChange}
              error={errors.address}
            />
            <Controls.Input
              name="email"
              label="email"
              value={values.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            <Controls.Input
              name="consignee_name"
              label="Получатель (ФИО или организация)"
              value={values.consignee_name}
              onChange={handleInputChange}
              error={errors.consignee_name}
            />
            <Controls.Input
              name="consignee_phone"
              label="Телефон получателя"
              value={values.consignee_phone}
              onChange={handleInputChange}
              error={errors.consignee_phone}
            />
            <Controls.Input
              name="consignee_data"
              label="Данные получателя (ИНН, паспорт)"
              value={values.consignee_data}
              onChange={handleInputChange}
              error={errors.consignee_data}
            />
            <Controls.Input
              name="delivery_note"
              label="Пожелание по доставке"
              value={values.delivery_note}
              onChange={handleInputChange}
              error={errors.delivery_note}
            />
            <Controls.Input
              name="delivery_ask"
              label="Уточнить при размещении заказа"
              value={values.delivery_ask}
              onChange={handleInputChange}
              error={errors.delivery_ask}
            />

            <div>
              <Controls.Button text="Сбросить" color="default" onClick={resetForm} />
              <Controls.Button type="submit" text="OK" />
            </div>
            <pre>{JSON.stringify(values, null, 4)}</pre>
          </Grid>
        </Grid>
      </FormPop>
    </>
  );
}
