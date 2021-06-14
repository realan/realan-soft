import React from "react";
// import { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useFormDialog, FormPop } from "../../components/useFormDialog";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

// import { PartySuggestions } from "react-dadata";
// import { AddressSuggestions } from "react-dadata";
// import ReactDadataBox from "react-dadata-box";
// import { TextField } from "@material-ui/core";
// import "react-dadata/dist/react-dadata.css";
// import { DADATA_API_KEY } from "constants/dadata";

const ADD_PERSON = gql`
  mutation AddPersonMutation($addData: persons_insert_input!) {
    insert_persons(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const initialValues = {
  full_name: "",
  name: "",
  gender: "",
  birthday: undefined,
  phone: "",
  email: "",
  passport: "",
  surname: "",
  fio: "",
  note: "",
};

export default function AddPersonDialog({ customerId }) {
  // const [contract, setContract] = useState({});
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues) temp.name = fieldValues.name ? "" : "Обязательное поле";
    if ("phone" in fieldValues)
      temp.phone = fieldValues.phone.length > 9 ? "" : "Нужно минимум 10 цифр.";
    if ("email" in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email) ? "" : "Проверить написание Email";
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
  const [AddPersonMutation, { loading, error }] = useMutation(ADD_PERSON);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const addData = {
        ...values,
        ["customer_id"]: customerId,
      };
      AddPersonMutation({ variables: { addData } });
      resetForm();
    }
  };

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <FormPop formName={"+ контакт"} onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            <Controls.Input
              name="name"
              label="Имя (как обращаться)"
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
            />
            <Controls.Input
              name="surname"
              label="Отчество"
              value={values.surname}
              onChange={handleInputChange}
              error={errors.surname}
            />
            <Controls.Input
              name="full_name"
              label="Полное имя"
              value={values.full_name}
              onChange={handleInputChange}
              error={errors.full_name}
            />
            <Controls.Input
              name="fio"
              label="ФИО"
              value={values.fio}
              onChange={handleInputChange}
              error={errors.fio}
            />
            <Controls.Input
              name="gender"
              label="Пол"
              value={values.gender}
              onChange={handleInputChange}
              error={errors.gender}
            />
            <Controls.Input
              name="phone"
              label="Телефон"
              value={values.phone}
              onChange={handleInputChange}
              error={errors.phone}
            />
            <Controls.Input
              name="email"
              label="email"
              value={values.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            <Controls.Input
              name="passport"
              label="Пасп данные"
              value={values.passport}
              onChange={handleInputChange}
              error={errors.passport}
            />
            <Controls.Input
              name="note"
              label="Примечание"
              value={values.note}
              onChange={handleInputChange}
              error={errors.note}
            />
            {/* <Controls.DateButton
              name="birthday"
              placeholder="День рождения"
              value={values.birthday}
              onChange={handleInputChange}
              error={errors.birthday}
            /> */}

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
