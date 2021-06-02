import React from "react";
// import { useState } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useFormDialog, FormPop } from "../../components/useFormDialog";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

import { PartySuggestions } from "react-dadata";
import { AddressSuggestions } from "react-dadata";
import ReactDadataBox from "react-dadata-box";
import "react-dadata/dist/react-dadata.css";
import { DADATA_API_KEY } from "constants/dadata";

const ADD_FIRM = gql`
  mutation AddFirmMutation($addData: firms_insert_input!) {
    insert_firms(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const our_firm_id = [
  { id: "1", name: "Дилер" },
  { id: "2", name: "Опт" },
  { id: "3", name: "Розница" },
];

// const initialValues = {
//   name: "",
//   discount: 0,
//   type: "",
//   tags: "",
//   dealer: "Реалан",
//   saldo: 0,
//   payment_term: "предоплата",
//   price_type_id: "2",
// };

const initialValues = {
  name: "",
  address: "",
  address_mail: "",
  management_name: "",
  management_post: "",
  inn: "",
  kpp: "",
  ogrn: "",
  okpo: "",
  account: "",
  bank: "",
  bic: "",
  corr_account: "",
  email: "",
  site: "",
  our_firm_id: undefined,
};

export default function AddFirmDialog({ customerId }) {
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues) temp.name = fieldValues.name ? "" : "Обязательное поле";
    if ("discount" in fieldValues)
      temp.discount = fieldValues.discount < 0.5 ? "" : "Скидка не более 0,5";
    // if ("mobile" in fieldValues)
    //   temp.mobile = fieldValues.mobile.length > 9 ? "" : "Нужно минимум 10 цифр.";
    if ("price_type_id" in fieldValues)
      temp.price_type_id = fieldValues.price_type_id.length != 0 ? "" : "Обязательное поле.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, errors, setErrors, handleInputChange, resetForm } = useFormDialog(
    initialValues,
    true,
    validate
  );
  const [AddFirmMutation, { loading, error }] = useMutation(ADD_FIRM);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const addData = {
        ...values,
        ["our_firm_id"]: Number(values.our_firm_id),
        ["customer_id"]: customerId,
      };
      console.log(addData);
      AddFirmMutation({ variables: { addData } });
      resetForm();
      // setOpen(false);
    }
  };

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <FormPop formName={"Добавить фирму"} onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={8}>
            <Controls.Input
              name="name"
              label="Заказчик"
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
            />
            <Controls.Input
              name="type"
              label="Тип заказчика"
              value={values.type}
              onChange={handleInputChange}
              error={errors.type}
            />

            <Controls.Input
              label="Скидка"
              name="discount"
              type="number"
              value={values.discount}
              onChange={handleInputChange}
              error={errors.discount}
            />
            <Controls.Input
              label="Начальное сальдо"
              name="saldo"
              type="number"
              value={values.saldo}
              onChange={handleInputChange}
              error={errors.saldo}
            />

            <Controls.Input
              name="payment_term"
              label="Условия оплаты"
              value={values.payment_term}
              onChange={handleInputChange}
              error={errors.payment_term}
            />
            <Controls.RadioGroup
              name="our_firm_id"
              label="Тип цены"
              value={values.our_firm_id}
              onChange={handleInputChange}
              items={our_firm_id}
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
