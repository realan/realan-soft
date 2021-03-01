import React from 'react';
import { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery} from "@apollo/react-hooks";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { makeStyles } from '@material-ui/core/styles';
import DateButton from 'components/DateButton/DateButton';
import GridItem from 'components/Grid/GridItem';

// import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';

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
    // const [delivery, setDelivery] = useState([]);
    const [state, setState] = useState({
      delivery: [],
      optionsConsignee: [],
      consigneeData: "",
      date_out: null,

    });

    const {loading, error, data} = useQuery(QUERY_DELIVERY);

    useEffect( () => {
        if (!loading && data){
            setState({delivery: data.delivery});
            onChange("packaging", "Без жу")
            if (orderData.hasOwnProperty("shop_id") && !orderData.hasOwnProperty("city")) {
                onChange("city", "Без жу")
            }
        }
    },[loading, data])

    useEffect( () => {

    },[])



    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;

    const listDelivery = state.delivery.map( item => {
        return <option value={item.id} key={item.id}>{item.name}</option>
      })

    const handleChange = (event) => {
        const idValue = event.target.value;
        const idType = event.target.id;
        onChange(idType, idValue)
      };


    // const handleDateChange = (date) => {
    //     onChange(idType, date)
    // }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Доставка
      </Typography>
      <Grid container spacing={2} alignItems="flex-end">

        <Grid item xs={8}>
          <FormControl  className={classes.formControl}>
              <InputLabel htmlFor="age-native-simple">Транспортная компания</InputLabel>
              <Select
                native
                // value={orderData.firmId}
                onChange={handleChange}
                inputProps={{
                  name: 'delivery',
                  id: 'delivery_id',
                }}
              >
                <option aria-label="None" value="" />
                {listDelivery}
              </Select>
          </FormControl>
        </Grid>
        {/* <GridItem item xs>
            <TextField value={orderData.city} label="Город" onChange={(event)=>onChange("city", event.target.value)}/>
        </GridItem> */}

        <Grid item xs={8}>
            <RadioGroup 
                row 
                aria-label="position" 
                name="position" 
                defaultValue="Без жу"
                onChange={(event)=>onChange("packaging", event.target.value)}
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
        {/* <GridItem item xs>
            <TextField value={orderData.packaging} label=" Упаковка" onChange={(event)=>onChange("packaging", event.target.value)} />
        </GridItem> */}
        

        <Grid item xs={8}>
            <FormControl  className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">Получатель</InputLabel>
                <Select
                    native
                    // value={orderData.firmId}
                    onChange={handleChange}
                    inputProps={{
                    name: 'consignee',
                    id: 'consignee',
                    }}
                >
                    <option aria-label="None" value="" />
                    <option value={orderData.firm_id} >Фирма</option>
                    <option value={orderData.person_id} >Персона</option>
                </Select>
            </FormControl>
        </Grid>    
        <Grid item xs>
            <TextField value={orderData.packaging} label=" Упаковка" onChange={(event)=>onChange("packaging", event.target.value)} />
        </Grid>           

        <Grid item xs={12}>
            Планируем отгрузку на 
            <DateButton 
                value={orderData.date_out}
                placeholder="Дата отгрузки" 
                onChange={(date) => onChange("date_out", date)}
            />
        </Grid>        
        

      </Grid>
    </React.Fragment>
  );
}

// id 	            integer, primary key, unique, default: nextval('orders_id_seq'::regclass)
// date_in 	        timestamp with time zone, default: now()
	
// customer_id 	    integer
// firm_id 	        integer, nullable
// person_id 	    integer, nullable
// shop_id 	        integer, nullable
	
// bill_id 	        integer, nullable
// invoice_id 	    integer, nullable
// our_firm_id 	    integer, nullable
// price_type_id 	integer
// discount 	    numeric, default: 0
// pay_till_date 	timestamp with time zone, nullable
// payment_status 	text, nullable
// payment_ratio 	numeric, default: 0
// sum 	            numeric, nullable
// weigth 	        numeric, nullable
	
// note_order 	    text, nullable
// note_supplier 	text, nullable
	
// is_cancelled 	boolean, default: false
	
// delivery_id 	    integer, nullable
// consignee_data 	text, nullable
// note_delivery 	text, nullable
// date_out 	    timestamp with time zone, nullable
// packaging 	    text, nullable
// consignee 	    text, nullable
// is_shipped 	    boolean, default: false
// city 	        text, nullable