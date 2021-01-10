import React from "react";
// import { useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { green } from "@material-ui/core/colors";
import InputGroup from "components/InputGroup/InputGroup";

const useStyles = makeStyles({
  root: {
    maxWidth: 250,
  },
  title: {
    backgroundColor: green[300],
  },
  subtitle: {
    backgroundColor: green[100],
  },
});

const defaultProps = {
  bgcolor: "background.paper",
  m: 1,
  border: 2,
  borderRadius: 6,
  style: { width: "7rem", height: "3rem" },
};

function CardPosInOrder(props) {
  // const [allStockBtn, setAllStockBtn] = useState(true);
  // const [allProdBtn, setAttProdBtn] = useState(true);

  // key
  // value - orderQty, needQty, dateOut, note, order id, customer (name), town
  // stock = {stockQty}
  // onChange = {onQtyChange}

  // console.log(props)
  // console.log(props.value.id, props.value.orderId, props.valueDB.length)
  const classes = useStyles();

  let fromProd = props.valueDB[props.value.id].qtyFromProd;
  let fromStock = props.valueDB[props.value.id].qtyFromStock;
  let stock = props.stock;
  let need = props.value.needQty;
  let collect = props.value.orderQty - need;

  // if (fromProd + fromStock >= need) { setAllStockBtn(false) }
  // if (fromProd + fromStock >= need || stock <=0 ) { setAttProdBtn(false) }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textPrimary">
          {props.value.town}
        </Typography>
        <Typography className={classes.subtitle} color="textPrimary" gutterBottom>
          {props.value.customer}
        </Typography>
        <Typography color="textSecondary" variant="caption" gutterBottom>
          {props.value.dateOut}
        </Typography>
        <Typography color="textSecondary" variant="caption" gutterBottom>
          {props.value.note}
        </Typography>

        <Box display="flex" justifyContent="center">
          <Box borderColor="success.main" {...defaultProps}>
            заказ {props.value.orderQty}
          </Box>
          <Box borderColor="primary.main" {...defaultProps}>
            Нужно {need}
          </Box>
        </Box>
        <Box mr={1}>
          П{" "}
          <InputGroup
            minValue={0}
            maxValue={need - fromStock}
            type={"prod"}
            id={props.value.id}
            onChange={props.onChange}
          />
        </Box>

        {/* { (stock !== 0 || collectStock !== 0) &&            */}
        <Box mr={1}>
          С
          <InputGroup
            minValue={-collect}
            maxValue={stock < need - fromProd ? stock : need - fromProd}
            type={"stock"}
            id={props.value.id}
            onChange={props.onChange}
          />
        </Box>
        {/* } */}
      </CardContent>
    </Card>
  );
}

export default CardPosInOrder;
