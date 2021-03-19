import React from "react";
import { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
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

// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from "@material-ui/core/Checkbox";

const QUERY_DELIVERY = gql`
  query QueryDelivery {
    delivery {
      id
      name
    }
  }
`;

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
      onChange("packaging", "Без жу");
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

  // const handleChange = (event) => {
  //   const idValue = event.target.value;
  //   const idType = event.target.id;
  //   onChange(idType, idValue);
  // };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Доставка
      </Typography>
      <Grid container spacing={2} alignItems="baseline">
        <Grid item xs={8}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">Транспортная компания</InputLabel>
            <Select
              native
              value={orderData.deliveryData.delivery_id || ""}
              onChange={(event) =>
                onChange("deliveryData", {
                  ...orderData.deliveryData,
                  delivery_id: event.target.value,
                })
              }
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
            defaultValue="Без жу"
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
            value={orderData.packaging}
            label=" Упаковка"
            onChange={(event) => onChange("packaging", event.target.value)}
          />
        </GridItem>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Город"
            value={orderData.deliveryData.city}
            onChange={(event) =>
              onChange("deliveryData", { ...orderData.deliveryData, city: event.target.value })
            }
          />
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            label="Получатель"
            value={orderData.deliveryData.consignee_name}
            onChange={(event) =>
              onChange("deliveryData", {
                ...orderData.deliveryData,
                consignee_name: event.target.value,
              })
            }
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Телефон получателя"
            value={orderData.deliveryData.consignee_phone}
            onChange={(event) =>
              onChange("deliveryData", {
                ...orderData.deliveryData,
                consignee_phone: event.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            label="Данные получателя (ИНН, паспорт и пр.)"
            value={orderData.deliveryData.consignee_data}
            onChange={(event) =>
              onChange("deliveryData", {
                ...orderData.deliveryData,
                consignee_data: event.target.value,
              })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Адрес"
            value={orderData.deliveryData.address}
            onChange={(event) =>
              onChange("deliveryData", { ...orderData.deliveryData, address: event.target.value })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Примечание по доставке"
            value={orderData.deliveryData.delivery_note}
            onChange={(event) =>
              onChange("deliveryData", {
                ...orderData.deliveryData,
                delivery_note: event.target.value,
              })
            }
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
