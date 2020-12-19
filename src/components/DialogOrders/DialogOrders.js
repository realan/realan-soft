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
import RowCollectOrder from "components/RowCollectOrder/RowCollectOrder.js";

// core components
import Table from "components/Table/Table.js";
// import Button from "components/CustomButtons/Button.js";
// import styles from "assets/jss/smaterial-dashboard-pro-react/views/extendedTablesStyle.js";
// material-ui components
// import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
// import Remove from "@material-ui/icons/Remove";
// import Add from "@material-ui/icons/Add";
// import Close from "@material-ui/icons/Close";
// import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";



// const useStyles = makeStyles(styles);

const GET_ORDERS_BY_ID = gql`
  query QueryOrdersByItemId($item_id: Int!) {
        mr_items(where: {item: {_eq: $item_id}, mr_order: {is_shipped: {_eq: false}}}) {
            order
            qty
            note
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
    // const classes = useStyles();

    let item_id=props.item_id;

    const { loading, error, data } = useQuery(
        GET_ORDERS_BY_ID,
        { variables: {item_id} }
    );
    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;
  
    console.log(data.mr_price[0])
    console.log(data.mr_items)

    const rowOrders=data.mr_items.map( (ord, key) => {
        let collectQty = ord.mr_order.mr_to.reduce( (sum, current) => sum + current.qty, 0) -
          ord.mr_order.mr_from.reduce( (sum, current) => sum + current.qty, 0);

        return (
        <tr key={key}>
          <RowCollectOrder
            customer={ord.mr_order.mr_customer.name}
            town={ord.mr_order.town}
            date={ord.mr_order.date_out}
            orderQty={ord.qty}
            collectQty={collectQty}
            note={ord.note}
          />

        </tr>
        )
    });

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.PaperhandleClose}
                fullWidth={true}
                maxWidth="md"
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                  {data.mr_price[0].name}
                </DialogTitle>
                <DialogContent>

                  <table>
                    <thead>
                      <tr>
                          <td> Заказчик</td>
                          <td> Город</td>
                          <td> Дата отгрузки</td>
                          <td> Заказано</td>
                          <td> Набрано</td>
                          <td> Добавляем</td>
                          <td> Набралось</td>
                          <td> Заношу инфу</td>
                          <td> Примечание</td>
                      </tr>
                    </thead>
                    <tbody>
                      {rowOrders}
                    </tbody>
                </table>

                <Table
                  tableHead={["Заказчик","Город","Заказ","Дата отгрузки","Набрано"]}
                  tableData={[]}
                />

                  <DialogContentText>
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
