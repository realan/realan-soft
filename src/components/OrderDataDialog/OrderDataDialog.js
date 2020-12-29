import React  from "react";
import { useState, useEffect, useMemo } from 'react';
import { gql } from "apollo-boost";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { XGrid } from '@material-ui/x-grid';
import { DataGrid } from '@material-ui/data-grid';

// const useStyles = makeStyles(styles);


const SUBSCRIPTION_ITEMS_IN_ORDER = gql`
    subscription SubscriptionsItemsInOrder($order_id: Int!) {
        mr_items(order_by: {item: asc}, where: {mr_order: {id: {_eq: $order_id}}}) {
        id
        item
        qty
        note
        mr_price {
            name
            qty_to: mr_movings_aggregate(where: {to_order: {_eq: $order_id}}) {
            aggregate {
                sum {
                qty
                }
            }
            }
            qty_from: mr_movings_aggregate(where: {from_order: {_eq: $order_id}}) {
            aggregate {
                sum {
                qty
                }
            }
            }
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

const OrderDataDialog = (props) => {
    // const classes = useStyles();
    const [rows, setRows] = useState( [] );
    // const [stockQty, setStockQty] = useState(0);


    const columns = useMemo( () =>
    [
      { field: 'id', headerName: 'id', width: 30 },
      { field: 'name', headerName: 'Наименование', width: 200 },
      { field: 'qtyOrder', headerName: 'Заказ', width: 100 },
      { field: 'qtyCollect', headerName: 'Набрано', width: 100 },
      { field: 'note', headerName: 'Примечание', width: 200 },  
    ]
    , []);

    let order_id=props.order_id;

    const { loading, error, data } = useSubscription(
        SUBSCRIPTION_ITEMS_IN_ORDER,
      { variables: {order_id} }
    );

    useEffect(() => {
        if(!loading && data){
            setRows(data.mr_items.map( (it) => {
                let qtyCollect = it.mr_price.qty_to.aggregate.sum.qty
                return {
                id: it.id,
                name: it.mr_price.name,
                qtyOrder: it.qty,
                qtyCollect: qtyCollect,
                note: it.note,
                }
            }));
        }
    }, [loading, data])

    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;

    console.log(data)
 
    const handleOK = () => {
      props.handleClose();
    };

    const handleCancel = () => {
      props.handleClose();
    }

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                fullWidth={true}
                maxWidth="md"
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                  aksdjflasjhflskj
                  <Button onClick={props.handleClose} color="primary" variant="outlined">
                    Нasdfaksjfs;
                  </Button>
                </DialogTitle>
                <DialogContent>
                    <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        rowHeight={32}
                    />
                    </div>


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

export default OrderDataDialog;
