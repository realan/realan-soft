import React from "react";
import Button from "@material-ui/core/Button";
import { useState, useEffect } from "react";
// import OrderFormCustomerData from "./OrderFormCustomerData";
// import OrderFormDelivery from "./OrderFormDelivery";
// import OrderFormDocs from "./OrderFormDocs";
// import OrderFormItems from "./OrderFormItems";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { grey } from "@material-ui/core/colors";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { newOrderFormState } from "../Forms/OrderProcessing/orderConstants";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import SupplierOrderItems from "./SupplierOrderItems";
import DateButton from "components/DateButton/DateButton";
import { TextField } from "@material-ui/core";

const QUERY_GET_SUPPLIERS = gql`
  query GetSuppliers {
    suppliers {
      id
      name
      our_discount
      customer_id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 900,
    backgroundColor: grey[100],
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 400,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SupplierOrderForm({
  orderData = newOrderFormState,
  onChange,
  onSubmit,
  onCancel,
  type,
}) {
  const classes = useStyles();
  const [options, setOptions] = useState([]);

  const { loading: loadSuppliers, error: errorSuppliers, data: dataSuppliers } = useQuery(
    QUERY_GET_SUPPLIERS
  );

  useEffect(() => {
    // console.log("dataSuppliers", dataSuppliers);
    if (dataSuppliers) {
      setOptions(dataSuppliers.suppliers);
    }
  }, [dataSuppliers]);

  const listSuppliers = options.map((item) => {
    return (
      <MenuItem value={item.customer_id} key={item.id}>
        {item.name}
      </MenuItem>
    );
  });

  if (loadSuppliers) return "loadingSuppliers...";
  if (errorSuppliers) return `Error! ${errorSuppliers.message}`;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container spacing={2} alignItems="baseline">
          <Grid item xs={6}>
            <FormControl className={classes.formControl}>
              <InputLabel id="simple-select-label_suppl">Поставщики</InputLabel>
              <Select
                labelId="simple-select-label_suppl"
                id="simple-select-label_suppl"
                value={orderData.supplier_id}
                onChange={(event) => onChange("customer_id", event.target.value)}
              >
                {listSuppliers}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Тип цены</FormLabel>
              <RadioGroup
                row
                aria-label="pricetype"
                name="price_type_id"
                value={orderData.price_type_id}
                onChange={(event) => onChange("price_type_id", event.target.value)}
              >
                <FormControlLabel value="1" control={<Radio />} label="Дилер" />
                <FormControlLabel value="3" control={<Radio />} label="Розница" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Обозначение заказа"
              value={orderData.note_order}
              onChange={(event) => onChange("note_order", event.target.value)}
            />
          </Grid>
          <DateButton
            value={orderData.date_out}
            placeholder="Дата отгрузки"
            onChange={(date) => onChange("date_out", date)}
          />
        </Grid>

        <SupplierOrderItems orderData={orderData} onChange={onChange} type={type} />
      </CardContent>
      <CardActions>
        <Box flexGrow={1}>
          <Button onClick={onCancel} color="primary" variant="outlined">
            Отмена
          </Button>
        </Box>
        <Button onClick={onSubmit} color="primary" variant="contained">
          OK
        </Button>
      </CardActions>
    </Card>
  );
}
