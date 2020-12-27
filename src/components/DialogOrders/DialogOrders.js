import React  from "react";
import { useState, useEffect } from 'react';
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Button from '@material-ui/core/Button';
// import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
// import Table from "../Table/Table.js";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import RowCollectOrder from "components/RowCollectOrder/RowCollectOrder.js";

// const useStyles = makeStyles(styles);

const GET_ORDERS_BY_ID = gql`
  query QueryOrdersByItemId($item_id: Int!) {
        mr_items(where: {item: {_eq: $item_id}, mr_order: {is_shipped: {_eq: false}}}, order_by: {mr_order: {date_out: asc_nulls_last}}) {
            order
            qty
            note
            mr_order {
              id
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

const ADD_MOVE = gql`
  mutation AddMove ($addData: mr_moving_insert_input!){
    insert_mr_moving (objects: [$addData]) 
    {
      affected_rows      
        returning {
          qty
          to_order
          from_order
          item
      }
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
    const [dataDB, setDataDB] = useState( [] ); // для добавления в бд перемещений ассортимента с производства и склада
    const [stockQty, setStockQty] = useState(0);

    const [AddMove] = useMutation(ADD_MOVE);

    let item_id=props.item_id;

    const { loading, error, data } = useQuery(
        GET_ORDERS_BY_ID,
        { variables: {item_id} }
    );

    useEffect( ()=> {
      setStockQty(props.stock_now)}, 
      [props.stock_now] 
    );

    useEffect(() => {
      if(!loading && data){
        setDataDB(data.mr_items.map( (ord) => {
          return {
            qty: 0, // initial value
            qtyFromStock: 0, // initial value 
            to_order: ord.mr_order.id,
            item: item_id,
          }
      }));
      }
    }, [loading, data, item_id])

    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;
 
    const handleOK = () => {
      dataDB.map( (it) => {
          if (it.qty !== 0) {
            console.log(it);
            let addData = {
              qty: it.qty,
              to_order: it.to_order,
              from_order: 2, // у доработки ID = 2 - типа постоянное значение заказа !!!!!!!!
              item: it.item,
            };
            AddMove({
              variables: {addData: addData },
              refetchQueries: [GET_ORDERS_BY_ID, { variables: {item_id} }], // ЖОПА
            });
          }
          if (it.qtyFromStock !== 0) {
            console.log(it);
            let addData = {
              qty: it.qtyFromStock,
              to_order: it.to_order,
              from_order: 3, // у склада ID = 3 - типа постоянное значение заказа !!!!!!!!
              item: it.item,
            };
            AddMove({
              variables: {addData: addData },
              refetchQueries: [GET_ORDERS_BY_ID, { variables: {item_id} }], // ЖОПА
            });
          }
          return 1; //хз почему return
      })
      props.handleClose();
    };

    const handleCancel = () => {
      setStockQty(props.stock_now);
      props.handleClose();
    }

    const onQtyChange = (id, qty) => {
      setDataDB([...dataDB], dataDB[id].qty = qty);
      // console.log(dataDB)
    }

    const onStockQtyChange = (id, qtyFromStock) => {
      setDataDB([...dataDB], dataDB[id].qtyFromStock = qtyFromStock);
      let sumQtyFromStock = dataDB.reduce( function (sum, elem) {return sum + elem.qtyFromStock}, 0);
      console.log(sumQtyFromStock);
      setStockQty(props.stock_now - sumQtyFromStock);
      // console.log(dataDB)
    }

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
            onQtyChange={onQtyChange}
            onStockQtyChange={onStockQtyChange}
            stockQty={stockQty}
            id={key}
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
                  <Button onClick={props.handleClose} color="primary" variant="outlined">
                    На складе {stockQty} шт.
                  </Button>
                </DialogTitle>
                <DialogContent>

                  <table>
                    <thead>
                      <tr>
                          <td> Заказчик</td>
                          <td> Город</td>
                          <td> Дата отгрузки</td>
                          <td> Заказано</td>
                          <td> Нужно</td>
                          <td> С доработки</td>
                          <td> Со склада</td>
                          <td> Примечание</td>
                      </tr>
                    </thead>
                    <tbody>
                      {rowOrders}
                    </tbody>
                </table>

                {/* <Table
                  tableHead={["Заказчик","Город","Заказ","Дата отгрузки","Набрано"]}
                  tableData={[]}
                /> */}

                  <DialogContentText>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCancel} color="primary" variant="outlined">
                    Отмена
                </Button>
                <Button onClick={handleOK} color="primary" variant="contained">
                    Подтвердить
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DialogOrders;
