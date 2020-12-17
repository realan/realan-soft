import React  from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

// core components
import Table from "components/Table/Table.js";
// import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
// material-ui components
import { makeStyles } from "@material-ui/core/styles";
// material-ui icons
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import Close from "@material-ui/icons/Close";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";



const useStyles = makeStyles(styles);

const GET_ORDERS_BY_ID = gql`
    query QueryOrdersByItemId($item_id: Int!) {
        mr_items(where: {item: {_eq: $item_id}, mr_order: {is_shipped: {_eq: false}}}) {
            order
            qty
            mr_order {
              customer
              town
              date_out
              mr_customer {
                name
              }
              mr_to (where: {item: {_eq: $item_id}}){
                qty
              }
              mr_from(where: {item: {_eq: $item_id}}) {
                qty
              }
            }
        }
        mr_price(where: {id: {_eq: $item_id}}) {
            id
            name
        }
    }
`;

function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
}

const DialogOrders = (props) => {
    const classes = useStyles();
    let item_id=props.item_id;

    const { loading, error, data } = useQuery(
        GET_ORDERS_BY_ID,
        { variables: {item_id} }
    );
    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;
  
    console.log(data.mr_price[0])
    console.log(data.mr_items)

    const rowOrders=data.mr_items.map( (ord) => {
        let collectQty = ord.mr_order.mr_to.reduce( (a, b) => a.qty + b.qty, 0);
        console.log(collectQty);
        return (
        <tr key={ord.id}>
            <td> {ord.mr_order.mr_customer.name}</td>
            <td> {ord.mr_order.customer.town}</td>
            <td> {ord.qty}</td>
            <td> {ord.mr_order.date_out}</td>
            <td> {collectQty}</td>
        </tr>
        )
    });

    
    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.PaperhandleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {data.mr_price[0].name}
                </DialogTitle>
                <DialogContent>
                <DialogContentText>

                <table>
                  <thead>
                  <tr>
                      <td> Заказчик</td>
                      <td> Город</td>
                      <td> Заказ</td>
                      <td> Дата отгрузки</td>
                      <td> Набрано</td>
                  </tr>
                  </thead>
                  <tbody>
                    {rowOrders}
                  </tbody>
                </table>




                {/* <Table
      tableHead={["Заказ","Заказано","Набрано","PRICE","QTY","AMOUNT",""]}
      tableData={[
        [

            "Dolce Gabbana",
          "Red",
          "M",
          <span>
            1{' '}
            <div className={classes.buttonGroup}>
              <Button
                color="primary"
                size="small"
                round
                className={classes.firstButton}
              >
                <Remove className={classes.icon} />
              </Button>
              <Button
                color="primary"
                size="small"
                round
                className={classes.lastButton}
              >
                <Add className={classes.icon} />
              </Button>
            </div>
          </span>,
          <span>
            <small className={classes.tdNumberSmall}>€</small> 549
          </span>,
          <Button  className={classes.actionButton}>
            <Close className={classes.icon} />
          </Button>
        ],
        {
          purchase: true,
          colspan: "6",
          col: {
            colspan: 2,
            text: (
              <Button color="secondary" round>
                Complete Purchase{" "}
                <KeyboardArrowRight className={classes.icon} />
              </Button>
            )
          }
        }
      ]}
      tableShopping
      customHeadCellClasses={[
        classes.center,
        classes.description,
        classes.description,
        classes.right,
        classes.right,
        classes.right
      ]}
      // 0 is for classes.center, 2 is for classes.description, 3 is for classes.description
      // 4 is for classes.right, 5 is for classes.right, 6 is for classes.right
      customHeadClassesForCells={[0, 2, 3, 4, 5, 6]}
      customCellClasses={[
        classes.tdName,
        classes.tdNumber,
        classes.tdNumber + " " + classes.tdNumberAndButtonGroup,
        classes.tdNumber
      ]}
      // 1 is for classes.tdName, 4 is for classes.tdNumber, 6 is for classes.tdNumber
      // 5 is for classes.tdNumber + " " + classes.tdNumberAndButtonGroup
      customClassesForCells={[1, 4, 5, 6]}
    /> */}


                    
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={props.handleClose} color="primary">
                    Subscribe
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DialogOrders;
