import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from "../../components/useForm";
// import * as employeeService from "../../services/employeeService";

// const genderItems = [
//   { id: "male", title: "Male" },
//   { id: "female", title: "Female" },
//   { id: "other", title: "Other" },
// ];

const price_type_id = [
  { id: 1, name: "Дилер" },
  { id: 2, name: "Опт" },
  { id: 3, name: "Розница" },
];

// const initialFValues = {
//   id: 0,
//   fullName: "",
//   email: "",
//   mobile: "",
//   city: "",
//   gender: "male",
//   departmentId: "",
//   hireDate: new Date(),
//   isPermanent: false,
// };

const initialFValues = {
  id: 0,
  name: "",
  discount: 0,
  type: "",
  tags: "",
  dealer: "Реалан",
  saldo: 0,
  payment_term: "предоплата",
  price_type_id: 2,
};

export default function AddCustomerForm() {
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues) temp.name = fieldValues.name ? "" : "Обязательное поле";
    // if ("email" in fieldValues)
    //   temp.email = /$^|.+@.+..+/.test(fieldValues.email) ? "" : "Email недействителен";
    // if ("mobile" in fieldValues)
    //   temp.mobile = fieldValues.mobile.length > 9 ? "" : "Нужно минимум 10 цифр.";
    if ("price_type_id" in fieldValues)
      temp.price_type_id = fieldValues.price_type_id.length != 0 ? "" : "Обязательное поле.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = useForm(
    initialFValues,
    true,
    validate
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log(validate);
      console.log(values);
      // employeeService.insertEmployee(values);
      resetForm();
    }
  };

  // { name: "text" },
  // { discount: "number" },
  // { date_start: "text" },
  // { type: "text" },
  // { tags: "text" },
  // { dealer: "text" },
  // { saldo: "number" },
  // { payment_term: "text" },
  // { price_type_id: "number" },

  return (
    <Form onSubmit={handleSubmit}>
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
            label="Скидка"
            name="discount"
            value={values.discount}
            onChange={handleInputChange}
            error={errors.discount}
          />
          <Controls.Input
            label="Начальное сальдо"
            name="saldo"
            value={values.saldo}
            onChange={handleInputChange}
            error={errors.saldo}
          />
          <Controls.Input
            label="Тип"
            name="city"
            value={values.city}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Controls.RadioGroup
            name="price_type_id"
            label="Тип цены"
            value={values.price_type_id}
            onChange={handleInputChange}
            items={price_type_id}
          />
          {/* <Controls.Select
            name="departmentId"
            label="Department"
            value={values.departmentId}
            onChange={handleInputChange}
            options={employeeService.getDepartmentCollection()}
            error={errors.departmentId}
          />
          <Controls.DatePicker
            name="hireDate"
            label="Hire Date"
            value={values.hireDate}
            onChange={handleInputChange}
          /> 
          <Controls.Checkbox
            name="isPermanent"
            label="Permanent Employee"
            value={values.isPermanent}
            onChange={handleInputChange}
          /> */}

          <div>
            <Controls.Button type="submit" text="Submit" />
            <Controls.Button text="Reset" color="default" onClick={resetForm} />
          </div>
        </Grid>
      </Grid>
    </Form>
  );
}
