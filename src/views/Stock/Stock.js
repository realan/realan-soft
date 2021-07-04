import React from "react";
import { gql } from "apollo-boost";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/react-hooks";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import SupplyOrderRegister from "./SupplyOrderRegister";
// import { withStyles } from "@material-ui/core/styles";
// import { XGrid } from '@material-ui/x-grid';

const QUERY_SUPPLY_ORDERS = gql`
  query QuerySupplyOrders {
    orders(where: { is_purchase: { _eq: true } }) {
      id
      date_out
      note_order
      customer {
        name
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  textFieldEmpty: {
    background: "pink",
  },
  textFieldExists: {
    background: "PaleGreen",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 400,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Stock = () => {
  const classes = useStyles();
  const [batchData, setBatchData] = useState({
    number: "",
    isExist: false,
  });

  const [options, setOptions] = useState([]);
  const [orderId, setOrderId] = useState(undefined);

  const { loading, error, data } = useQuery(QUERY_SUPPLY_ORDERS);

  useEffect(() => {
    if (!loading && data) {
      let preparedData = data.orders.map((it) => {
        return {
          id: it.id,
          date_out: it.date_out,
          note_order: it.note_order,
          name: it.customer.name + " --- " + it.note_order + " --- " + it.date_out,
        };
      });
      setOptions(preparedData);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const listSets = options.map((item) => {
    return (
      <MenuItem value={item.id} key={item.id}>
        {item.name}
      </MenuItem>
    );
  });

  const handleBatchChange = (event) => {
    let flag = event.target.value === "" ? false : true;
    setBatchData({ number: event.target.value, isExist: flag });
  };

  const handleChange = (event) => {
    setOrderId(event.target.value);
  };

  return (
    <>
      <Box>
        <FormControl className={classes.formControl}>
          <InputLabel id="simple-select-label_set">Заказ поставщику</InputLabel>
          <Select
            labelId="simple-select-label_set"
            id="simple-select-label_set"
            value={orderId}
            onChange={handleChange}
          >
            {listSets}
          </Select>
        </FormControl>
        <Box flexGrow={1}>
          <TextField
            className={batchData.isExist ? classes.textFieldExists : classes.textFieldEmpty}
            label="Номер коробки/лотка"
            variant="outlined"
            id="custom-outlined-input"
            value={batchData.number}
            onChange={handleBatchChange}
          />
        </Box>
        {orderId && <SupplyOrderRegister orderId={orderId} />}
      </Box>
    </>
  );
};

export default Stock;
