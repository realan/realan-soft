import React from "react";
import Grid from "@material-ui/core/Grid";
// import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
// import FormTemplate from "components/FormTemplate/FormTemplate";
// import { columnsCustomers } from "./orderConstants";
import FormSection from "components/FormSection/FormSection";
import AddFirmDialog from "../AddFirmDialog";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 350,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SelectCustomer({ orderData, onChange, options }) {
  const classes = useStyles();

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

  const handleCustomerChange = (event, val) => {
    console.log("handleCustomerChange", val);
    let customerId;
    val ? (customerId = Number(val.id)) : (customerId = undefined);
    onChange("customer_id", customerId);
  };

  // const header = orderData.customer_id ? orderData.customer.name : "Выбери заказчика";
  // console.log("orderData in Customer block", orderData);
  return (
    <FormSection title={"Данные заказчика"} icon={""}>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={8}>
          <Autocomplete
            id="combo-box-customers"
            // inputValue={orderData.customer.name || ""}
            value={orderData.customer.name}
            // open={true}
            options={options.customers} //.sort((a, b) => -b.town.localeCompare(a.town))}
            getOptionSelected={(option, value) => option.name === value}
            // groupBy={(option) => option.city}
            getOptionLabel={(option) => `${option.name}`}
            // style={{ width: 300 }}
            onChange={handleCustomerChange} // (event, val) => onChange("customer_id", Number(val.id))}
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
              onChange={(event) => onChange("firm_id", Number(event.target.value))}
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
            <AddFirmDialog customerId={orderData.customer_id} />
            // <FormTemplate
            //   fields={columnsCustomers}
            //   buttonText={"+фирма"}
            //   headerText={"Добавить фирму"}
            // />

            //* <Button color="primary" variant="outlined">
            //  + фирма
            //</Button> */}
          )}
        </Grid>

        <Grid item xs={8}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">Магазин (Получатель)</InputLabel>
            <Select
              native
              required
              value={orderData.shop_id || ""}
              onChange={(event) => onChange("shop_id", Number(event.target.value))}
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
              onChange={(event) => onChange("person_id", Number(event.target.value))}
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
        {orderData.person_id && (
          <>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                label="Телефон"
                value={
                  orderData.customer.persons.find((item) => item.id === orderData.person_id).phone
                }
                //onChange={(event) => onChange("city", event.target.value)}
              />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                disabled
                label="email"
                value={
                  orderData.customer.persons.find((item) => item.id === orderData.person_id).email
                }
                //onChange={(event) => onChange("consignee_name", event.target.value)}
              />
            </Grid>
          </>
        )}
      </Grid>
    </FormSection>
  );
}
