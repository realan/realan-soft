import React from "react";
import { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 350,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const SUBSCRIPTION_CUSTOMERS = gql`
  subscription SubscriptionsCustomers {
    customers(where: { id: { _gt: 10 } }) {
      id
      name
      discount
      saldo
      payment_term
      price_type_id
      shops {
        id
        name
        city
        address
        consignee_name
        consignee_phone
        consignee_data
        delivery_note
        delivery_id
      }
      firms {
        id
        name
        contracts {
          our_firm_id
        }
      }
      persons {
        id
        email
        full_name
        name
        surname
        phone
        firm_id
        shop_id
      }
    }
  }
`;

export default function SelectCustomer({ orderData, onChange }) {
  const initialOptions = {
    firms: orderData.customer.firms || [],
    shops: orderData.customer.shops || [],
    persons: orderData.customer.persons || [],
    consigneeArr: [],
  };

  const classes = useStyles();
  const [customers, setCustomers] = useState([]);
  const [options, setOptions] = useState(initialOptions);

  console.log("render", orderData, customers, options);

  const { loading, error, data } = useSubscription(SUBSCRIPTION_CUSTOMERS);

  useEffect(() => {
    if (!loading && data) {
      setCustomers(data.customers);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const getInputCustomer = (event, val) => {
    if (val !== null) {
      console.log(val);
      setOptions({
        firms: val.firms,
        shops: val.shops,
        persons: val.persons,
      });
      onChange("customer", val);
      onChange("customer_id", val.id);
      onChange("discount", val.discount);
      onChange("saldo", val.saldo);
      onChange("price_type_id", val.price_type_id);
      onChange("payment_term", val.payment_term);

      if (val.firms.length === 1) {
        onChange("firm_id", val.firms[0].id);
      }
      if (val.shops.length === 1) {
        onChange("shop_id", val.shops[0].id);
      }
      if (val.persons.length === 1) {
        onChange("person_id", val.persons[0].id);
      }
    }
  };

  const handleChange = (event) => {
    // console.log(event.target)
    const idValue = Number.parseInt(event.target.value);
    const idType = event.target.id;
    onChange(idType, idValue);
    if (idType === "shop_id") {
      const shopData = options.shops.find((el) => el.id === idValue);
      const deliveryData = {
        city: shopData.city,
        address: shopData.address,
        consignee_name: shopData.consignee_name,
        consignee_phone: shopData.consignee_phone,
        consignee_data: shopData.consignee_data,
        delivery_note: shopData.delivery_note,
        delivery_id: shopData.delivery_id,
      };
      const arrPersons = orderData.customer.persons.filter(
        (item) => item.shop_id === idValue || item.firm_id
      );
      setOptions((prevState) => ({ ...prevState, persons: arrPersons }));

      onChange("deliveryData", deliveryData);
    }
  };

  const listFirms = options.firms.map((item) => {
    return (
      <option value={item.id} key={item.id}>
        {item.name}
      </option>
    );
  });
  const listShops = options.shops.map((item) => {
    return (
      <option value={item.id} key={item.id}>
        {item.name}
      </option>
    );
  });
  const listPersons = options.persons.map((item) => {
    return (
      <option value={item.id} key={item.id}>
        {item.full_name}
      </option>
    );
  });

  const header = orderData.customer_id ? orderData.customer.name : "Выбери заказчика";

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        {header}
      </Typography>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={8}>
          <Autocomplete
            id="combo-box-customers"
            // inputValue={orderData.customer.name || ""}
            // open={true}
            options={customers} //.sort((a, b) => -b.town.localeCompare(a.town))}
            // groupBy={(option) => option.town}
            getOptionLabel={(option) => option.name}
            // style={{ width: 300 }}
            onChange={getInputCustomer}
            renderInput={(params) => <TextField {...params} fullWidth label="Заказчик" required />}
          />
        </Grid>

        <Grid item xs>
          {orderData.saldo && <strong>Сальдо {orderData.saldo} руб. </strong>}
        </Grid>

        <Grid item xs={8}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">Фирма</InputLabel>
            <Select
              native
              value={orderData.firm_id || ""}
              onChange={handleChange}
              inputProps={{
                name: "firm",
                id: "firm_id",
              }}
            >
              <option aria-label="None" value="" />
              {listFirms}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs>
          {orderData.customer_id && (
            <Button color="primary" variant="outlined">
              + фирма
            </Button>
          )}
        </Grid>

        <Grid item xs={8}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">Магазин</InputLabel>
            <Select
              native
              required
              value={orderData.shop_id || ""}
              onChange={handleChange}
              inputProps={{
                name: "shop",
                id: "shop_id",
              }}
            >
              <option aria-label="None" value="" />
              {listShops}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs>
          {orderData.customer_id && (
            <Button color="primary" variant="outlined">
              + магазин
            </Button>
          )}
        </Grid>

        <Grid item xs={8}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">Контакт</InputLabel>
            <Select
              native
              value={orderData.person_id || ""}
              onChange={handleChange}
              inputProps={{
                name: "person",
                id: "person_id",
              }}
            >
              <option aria-label="None" value="" />
              {listPersons}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs>
          {orderData.customer_id && (
            <Button color="primary" variant="outlined">
              + контакт
            </Button>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
