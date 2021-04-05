import React from "react";
import { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
import DateButton from "components/DateButton/DateButton";
import { makeStyles } from "@material-ui/core/styles";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 350,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const QUERY_OUR_FIRMS = gql`
  query QueryOurFirms {
    our_firms {
      id
      firm_id
      name
    }
  }
`;

export default function DocumentsForm({ orderData, onChange }) {
  const classes = useStyles();
  const [ourFirms, setOurFirms] = useState([]);

  const { loading, error, data } = useQuery(QUERY_OUR_FIRMS);

  useEffect(() => {
    if (!loading && data) {
      setOurFirms(data.our_firms);
    }
  }, [loading, data]);

  useEffect(() => {
    let sum = 0;
    switch (orderData.price_type_id) {
      case 1:
        sum = orderData.orderParams.sum_dealer;
        break;
      case 2:
        sum = orderData.orderParams.sum_opt;
        break;
      case 3:
        sum = orderData.orderParams.sum_retail;
        break;
      default:
        break;
    }
    sum = sum * (1 - orderData.discount);
    onChange("sum", sum);
  }, [orderData.discount, orderData.price_type_id]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const listOurFirms = ourFirms.map((item) => {
    return (
      <option value={item.firm_id} key={item.id}>
        {item.name}
      </option>
    );
  });

  const handleChange = (event) => {
    const idValue = Number.parseInt(event.target.value);
    const idType = event.target.id;
    onChange(idType, idValue);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Документы.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          Масса <strong>{orderData.orderParams.weight}</strong>, сумма дилер{" "}
          {orderData.orderParams.sum_dealer} руб., сумма опт {orderData.orderParams.sum_opt} руб.,
          сумма розн {orderData.orderParams.sum_retail} руб. К оплате {orderData.sum} руб.
        </Grid>

        <Grid item xs={3}>
          <TextField
            fullWidth
            label="Скидка"
            type="number"
            value={orderData.discount}
            onChange={(event) => onChange("discount", Number(event.target.value))}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Условия оплаты"
            value={orderData.payment_term}
            onChange={(event) => onChange("payment_term", event.target.value)}
          />
        </Grid>
        <Grid item xs>
          <DateButton
            value={orderData.pay_till_date}
            placeholder="Напомнить о платеже"
            onChange={(date) => onChange("pay_till_date", date)}
          />
        </Grid>
        <Grid item xs={6}>
          <RadioGroup
            row
            aria-label="price_type"
            name="price_type"
            value={orderData.price_type_id}
            onChange={(event) => onChange("price_type_id", Number.parseInt(event.target.value))}
          >
            <FormControlLabel
              value={1}
              control={<Radio color="primary" />}
              label="Дилер"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value={2}
              control={<Radio color="primary" />}
              label="Опт"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value={3}
              control={<Radio color="primary" />}
              label="Розница"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={6}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">От какой фирмы делаем доки</InputLabel>
            <Select
              native
              value={orderData.our_firm_id || ""}
              onChange={handleChange}
              inputProps={{
                name: "firm",
                id: "our_firm_id",
              }}
            >
              <option aria-label="None" value="" />
              {listOurFirms}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Примечание к заказу"
            value={orderData.note_order || ""}
            onChange={(event) => onChange("note_order", event.target.value)}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
