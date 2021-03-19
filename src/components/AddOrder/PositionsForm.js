import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { useState, useEffect } from "react";
// import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import AddAllItemsInOrder from "components/AddAllItemsInOrder/AddAllItemsInOrder";

export default function PositionsForm({ orderData, onChange }) {
  const [state, setState] = useState({
    weight: 0,
    sum_opt: 0,
    sum_rozn: 0,
  });

  useEffect(() => {
    if (orderData.items) {
      let obj = {
        weight: orderData.items.reduce((sum, it) => sum + it.qty * it.weight, 0),
        sum_opt: orderData.items.reduce((sum, it) => sum + it.qty * it.price_opt, 0),
        sum_rozn: orderData.items.reduce((sum, it) => sum + it.qty * it.price_rozn, 0),
      };
      setState(obj);
      onChange("orderParams", obj);
    }
  }, [orderData.items]);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Позиции в заказе.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          Масса <strong>{state.weight}</strong>, сумма опт {state.sum_opt} руб., сумма розн{" "}
          {state.sum_rozn} руб.
        </Grid>
        <AddAllItemsInOrder onChange={(items) => onChange("items", items)} />
      </Grid>
    </React.Fragment>
  );
}
