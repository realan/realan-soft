import React from 'react';
import { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
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
    customers(where: {id: {_gt: 10}}) {
      id
      name
      discount
      shops {
        id
        name
        city
      }
      firms {
        id
        name
      }
      persons {
        id
        email
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
  
  const classes = useStyles();
  const [customers, setCustomers] = useState([]);
  const [options, setOptions] = useState({
    firms: [],
    shops: [],
    persons: [],
  });

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
      })
      onChange("customer", val)
      // onChange("customer_id", val.id);
    }
  };

  const handleChange = (event) => {
    // console.log(event.target)
    const idValue = Number.parseInt(event.target.value);
    const idType = event.target.id;
    onChange(idType, idValue)
    if (idType === "shop_id") { 
      const indexShop = options.shops.findIndex(el => el.id === idValue)
      onChange("city", options.shops[indexShop].city)
    }
  };

  const listFirms = options.firms.map( item => {
    return <option value={item.id} key={item.id}>{item.name}</option>
  })
  const listShops = options.shops.map( item => {
    return <option value={item.id} key={item.id}>{item.name}</option>
  })
  const listPersons = options.persons.map( item => {
    return <option value={item.id} key={item.id}>{item.name}</option>
  })

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Выбери заказчика
      </Typography>
      <Grid container spacing={2} alignItems="flex-end">

        <Grid item xs={12}>
          <Autocomplete
            id="combo-box-customers"
            // open={true}
            options={customers} //.sort((a, b) => -b.town.localeCompare(a.town))}
            // groupBy={(option) => option.town}
            getOptionLabel={(option) => option.name}
            // style={{ width: 300 }}
            onChange={getInputCustomer}
            renderInput={(params) => <TextField {...params} fullWidth label="Заказчик" required />}
          />
        </Grid>

        <Grid item xs={8}>
          <FormControl  className={classes.formControl}>
              <InputLabel htmlFor="age-native-simple">Фирма</InputLabel>
              <Select
                native
                // value={orderData.firmId}
                onChange={handleChange}
                inputProps={{
                  name: 'firm',
                  id: 'firm_id',
                }}
              >
                <option aria-label="None" value="" />
                {listFirms}
              </Select>
          </FormControl>
        </Grid>
        <Grid item xs>
          <Button color="primary" variant="outlined" >
            + фирма
          </Button>
        </Grid>

        <Grid item xs={8}>
          <FormControl  className={classes.formControl}>
              <InputLabel htmlFor="age-native-simple">Магазин</InputLabel>
              <Select
                native
                //value={state.age}
                onChange={handleChange}
                inputProps={{
                  name: 'shop',
                  id: 'shop_id',
                }}
              >
                <option aria-label="None" value="" />
                {listShops}
              </Select>
          </FormControl>
        </Grid>
        <Grid item xs>
          <Button color="primary" variant="outlined" >
            + магазин
          </Button>
        </Grid>

        <Grid item xs={8}>
          <FormControl  className={classes.formControl}>
              <InputLabel htmlFor="age-native-simple">Контакт</InputLabel>
              <Select
                native
                //value={state.age}
                onChange={handleChange}
                inputProps={{
                  name: 'person',
                  id: 'person_id',
                }}
              >
                <option aria-label="None" value="" />
                {listPersons}
              </Select>
          </FormControl>
        </Grid>
        <Grid item xs>
          <Button color="primary" variant="outlined" >
            + контакт
          </Button>
        </Grid>


      </Grid>
    </React.Fragment>
  );
}

          {/* <Autocomplete
            id="firmId"
            options={options.firms}
            style={{ width: 300 }}
            defaultValue="kjhkj"
            getOptionLabel={(option) => option.name}
            onChange={getInputFirm}
            renderInput={(params) => <TextField {...params} fullWidth label="Организация" required />}
          /> */}

                