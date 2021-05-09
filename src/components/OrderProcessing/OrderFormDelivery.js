import React from "react";
import { useState, useEffect } from "react";
// import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Grid from "@material-ui/core/Grid";
// import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { makeStyles } from "@material-ui/core/styles";
import DateButton from "components/DateButton/DateButton";
import GridItem from "components/Grid/GridItem";
import FormSection from "components/FormSection/FormSection";
import {QUERY_DELIVERY} from "./orderConstants";

// import { AddressSuggestions } from "react-dadata";
// // import ReactDadataBox from "react-dadata-box";
// // import "react-dadata/dist/react-dadata.css";
// import { DADATA_API_KEY } from "constants/dadata";

// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from "@material-ui/core/Checkbox";


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 350,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function DeliveryForm({ orderData, onChange }) {
  const classes = useStyles();
  const [state, setState] = useState({
    delivery: [],
    optionsConsignee: [],
    consigneeData: "",
    date_out: null,
  });

  const { loading, error, data } = useQuery(QUERY_DELIVERY);

  useEffect(() => {
    if (!loading && data) {
      setState({ delivery: data.delivery });
      // onChange("packaging", "Без жу");
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const listDelivery = state.delivery.map((item) => {
    return (
      <option value={item.id} key={item.id}>
        {item.name}
      </option>
    );
  });

  return (
    <FormSection
    title={"Доставка"}
    icon={""}
    >
      <Grid container spacing={2} alignItems="baseline">
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Пожелания по доставке от заказчика"
            value={orderData.delivery_note || ""}
            onChange={(event) => onChange("delivery_note", event.target.value)}
          />
        </Grid>
        <Grid item xs={8}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">Транспортная компания</InputLabel>
            <Select
              native
              value={orderData.delivery_id || ""}
              onChange={(event) => onChange("delivery_id", Number(event.target.value))}
              inputProps={{
                name: "delivery",
                id: "delivery_id",
              }}
            >
              <option aria-label="None" value="" />
              {listDelivery}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs>
          <DateButton
            value={orderData.date_out}
            placeholder="Дата отгрузки"
            onChange={(date) => onChange("date_out", date)}
          />
        </Grid>

        <Grid item xs={8}>
          <RadioGroup
            row
            aria-label="position"
            name="position"
            // defaultValue="Без жу"
            onChange={(event) => onChange("packaging", event.target.value)}
          >
            <FormControlLabel
              value="Без жу"
              control={<Radio color="primary" />}
              label="Без жу"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="Обрешетка"
              control={<Radio color="primary" />}
              label="Обрешетка"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="Палетный борт"
              control={<Radio color="primary" />}
              label="Палетный борт"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="Прочее"
              control={<Radio color="primary" />}
              label="Прочее"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </Grid>
        <GridItem item xs>
          <TextField
            value={orderData.packaging || ""}
            label=" Упаковка"
            onChange={(event) => onChange("packaging", event.target.value)}
          />
        </GridItem>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Город"
            value={orderData.city || ""}
            onChange={(event) => onChange("city", event.target.value)}
          />
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            label="Получатель"
            value={orderData.consignee_name || ""}
            onChange={(event) => onChange("consignee_name", event.target.value)}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Телефон получателя"
            value={orderData.consignee_phone || ""}
            onChange={(event) => onChange("consignee_phone", event.target.value)}
          />
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            label="Данные получателя (ИНН, паспорт и пр.)"
            value={orderData.consignee_data || ""}
            onChange={(event) => onChange("consignee_data", event.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          {/* <AddressSuggestions
            token={DADATA_API_KEY}
            label="Адрес"
            value={orderData.deliveryData.address}
            onChange={(suggestion) =>
              onChange("deliveryData", { ...orderData.deliveryData, address: suggestion })
            }
          /> */}
          <TextField
            fullWidth
            label="Адрес"
            value={orderData.address || ""}
            onChange={(event) => onChange("address", event.target.value)}
          />
        </Grid>
      </Grid>
    </FormSection>
  );
}
