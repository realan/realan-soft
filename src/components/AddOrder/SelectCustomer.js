import React from 'react';
import { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from "@material-ui/lab/Autocomplete";


const SUBSCRIPTION_CUSTOMERS = gql`
  subscription SubscriptionsCustomers {
    customers(where: {id: {_gt: 10}}) {
      id
      name
      shops {
        city
      }
      firms {
        name
      }
      persons {
        email
        name
        surname
        phone
      }
    }
  }
`;


export default function SelectCustomer() {
  const initialState = {

  };

  const [state, setState] = useState(initialState);
  const [options, setOptions] = useState([]);

  const { loading, error, data } = useSubscription(SUBSCRIPTION_CUSTOMERS);

  useEffect(() => {
    if (!loading && data) {
      // console.log(data)
      // let arr = data.customers.map( item => {
      //   return item.name
      // })
      setOptions(data.customers);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const getInput = (event, val) => {
    if (val !== null) {
      let obj = {
        ...state,
      };
      setState(obj);
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Выбери заказчика
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            id="combo-box"
            // open={true}
            options={options} //.sort((a, b) => -b.town.localeCompare(a.town))}
            // groupBy={(option) => option.town}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            // onChange={getInput}
            renderInput={(params) => <TextField {...params} fullWidth label="Заказчик" required />}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            fullWidth
            autoComplete="shipping address-line1"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="family-name"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}