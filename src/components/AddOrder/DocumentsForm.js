import React from "react";
// import { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
import DateButton from "components/DateButton/DateButton";

export default function DocumentsForm({ orderData, onChange }) {
  // const [state, setState] = useState({
  //     discount: orderData.customer.discount,
  // })

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Документы.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          Масса <strong>{orderData.orderParams.weight}</strong>, сумма опт{" "}
          {orderData.orderParams.sum_opt} руб., сумма розн {orderData.orderParams.sum_rozn} руб.
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

        <Grid item xs={4}>
          ТИП ЦЕНЫ
        </Grid>
        <Grid item xs={8}>
          <RadioGroup
            row
            aria-label="price_type"
            name="price_type"
            defaultValue={orderData.price_type_id}
            onChange={(event) => onChange("price_type_id", event.target.value)}
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
        <Grid item xs={4}>
          ОТ КАКОЙ ОРГАНИЗАЦИЙ ДЕЛАЕМ ДОКИ
        </Grid>
        <Grid item xs={8}>
          <RadioGroup
            row
            aria-label="position"
            name="position"
            defaultValue="ООО Реалан"
            onChange={(event) => onChange("our_firm", event.target.value)}
          >
            <FormControlLabel
              value="ООО Реалан"
              control={<Radio color="primary" />}
              label="ООО Реалан"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="Неоф"
              control={<Radio color="primary" />}
              label="Неоф"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="ООО Мрамолит"
              control={<Radio color="primary" />}
              label="ООО Мрамолит"
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
      </Grid>
    </React.Fragment>
  );
}
