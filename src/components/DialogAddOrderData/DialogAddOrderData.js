import React from "react";
import { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
// import Button from '@material-ui/core/Button';
// import DatePicker from "react-datepicker";
import DateButton from "components/DateButton/DateButton";
import "react-datepicker/dist/react-datepicker.css";
// import ru from "date-fns/locale/ru";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";

const SUBSCRIPTION_CUSTOMERS = gql`
  subscription SubscriptionsCustomers {
    mr_customer {
      id
      name
      town
      phone
      person
      email
      delivery
      discount
    }
  }
`;

const DialogAddOrderData = (props) => {
  const initialState = {
    customer: undefined,
    town: "",
    person: "",
    phone: "",
    email: "",
    delivery: "",
    discount: 0,
    date_in: new Date(),
    date_out: null,
  };

  const [state, setState] = useState(initialState);
  const [options, setOptions] = useState([]);

  const { loading, error, data } = useSubscription(SUBSCRIPTION_CUSTOMERS);

  useEffect(() => {
    if (!loading && data) {
      setOptions(data.mr_customer);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleDateChange = (date, type) => {
    if (type === "in") {
      setState({ ...state, date_in: date });
    } else {
      setState({ ...state, date_out: date });
    }
    let obj = state;
    props.onChange(obj);
  };

  const getInput = (event, val) => {
    if (val !== null) {
      let obj = {
        ...state,
        customer: val.id,
        town: val.town,
        person: val.person,
        phone: val.phone,
        email: val.email,
        delivery: val.delivery,
        discount: val.discount,
      };
      setState(obj);
      props.onChange(obj);
    }
  };

  return (
    <>
      <span>
        Дата заказа
        <DateButton
          value={state.date_in}
          onChange={(date) => {
            handleDateChange(date, "in");
          }}
        />
      </span>
      <span>
        Дата отгрузки
        <DateButton
          value={state.date_out}
          placeholder={"Дата отгрузки"}
          onChange={(date) => {
            handleDateChange(date, "out");
          }}
        />
      </span>
      <Autocomplete
        id="combo-box"
        // open={true}
        options={options.sort((a, b) => -b.town.localeCompare(a.town))}
        groupBy={(option) => option.town}
        getOptionLabel={(option) => option.name}
        style={{ width: 300 }}
        onChange={getInput}
        renderInput={(params) => <TextField {...params} label="Заказчик" required />}
      />
      <TextField value={state.town || ""} type="text" label="Город" />
      <TextField value={state.person || ""} type="text" label="Контактное лицо" />
      <TextField value={state.phone || ""} type="text" label="Телефон" />
      <TextField value={state.email || ""} type="email" label="email" />
      <TextField value={state.delivery || ""} type="text" label="ТК" />
      <TextField value={state.discount} type="number" label="Скидка" />
    </>
  );
};

export default DialogAddOrderData;
