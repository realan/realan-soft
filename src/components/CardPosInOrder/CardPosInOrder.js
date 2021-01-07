import React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { green } from '@material-ui/core/colors';
import InputGroup from 'components/InputGroup/InputGroup';

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
    bgcolor: 'background.paper',
    m: 1,
    border: 2,
    borderRadius: 6,
    style: { width: '7rem', height: '3rem' },
  };

export default function CardPosInOrder(props) {

  // key
  // value - orderQty, needQty, dateOut, note, order id, customer (name), town
  // stock = {stockQty}
  // onChange = {onQtyChange}

  const classes = useStyles();
  const [collectProd, setCollectProd] = useState(0);
  const [collectStock, setCollectStock] = useState(0);
  console.log(props)

  

  return (
    <Card className={classes.root}>
        <CardContent>
            <Typography className={classes.title} color="textPrimary" >
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
                <Box borderColor="success.main" {... defaultProps}>
                    заказ {props.value.orderQty}
                </Box>
                <Box borderColor="primary.main" {... defaultProps}>
                    Нужно {props.value.needQty}
                </Box>
            </Box>

            <Box mr={1}>
                П <InputGroup 
                  maxValue = { props.value.needQty - collectStock }
                  type = {"prod"}
                  id = {props.value.id}
                  onChange = {props.onChange}
                />
            </Box>
            
            {/* { props.stock !== 0 && props.fromStock !== 0 &&             } */}
              <Box mr={1}>
                С<InputGroup 
                  maxValue = {(props.stock < props.value.needQty - collectProd) ? props.stock : props.value.needQty - collectStock }
                  type = {"stock"}
                  id = {props.value.id}
                  onChange = {props.onChange}
                />
            </Box>

        </CardContent>

    </Card>
  );
}