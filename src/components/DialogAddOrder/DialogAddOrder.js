import React from "react";
import { useState, useEffect } from 'react';
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import DialogAddOrderItems from "components/DialogAddOrderItems/DialogAddOrderItems";
import DialogAddOrderNewCustomer from "components/DialogAddOrderNewCustomer/DialogAddOrderNewCustomer";
import DialogAddOrderData from "components/DialogAddOrderData/DialogAddOrderData";


const ADD_ORDER = gql`
  mutation AddOrder ($addData: mr_order_insert_input!){
    insert_mr_order (objects: [$addData]) 
    {
      affected_rows      
        returning {
            id
      }
    }
  }
`;

const ADD_ITEMS = gql`
  mutation AddItems ($addData: mr_items_insert_input!){
    insert_mr_items (objects: [$addData]) 
    {
      affected_rows      
        returning {
            id
      }
    }
  }
`;

// const useStyles = makeStyles((theme) => ({
//     root: {
//       padding: '2px 4px',
//       display: 'flex',
//       alignItems: 'center',
//       width: 400,
//     },
//     input: {
//       marginLeft: theme.spacing(1),
//       flex: 1,
//     },
//     iconButton: {
//       padding: 10,
//     },
//     divider: {
//       height: 28,
//       margin: 4,
//     },
//   }));


function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
}

const DialogAddOrder = (props) => {

    // const classes = useStyles();

    const [orderItems, setOrderItems] = useState([]);
    const [orderData, setOrderData] = useState({});

    const [AddOrder, {data: mutationData, loading: mutationLoading, error: mutationError }] = useMutation(ADD_ORDER);
    const [AddItems] = useMutation(ADD_ITEMS);

    useEffect(() => {                            // ЖОПА. Как сделать проще? 
        if(!mutationLoading && mutationData){
            let orderId = mutationData.insert_mr_order.returning[0].id;
            orderItems.forEach(function(item) {
                item["order"] = orderId;
            });
            console.log(orderItems);
        }
    }, [mutationLoading, mutationData, orderItems])

    if (mutationLoading) return "Loading....";
    if (mutationError) return `Error! ${mutationError.message}`;

    const handleAddOrder = () => {
        AddOrder({ variables: {addData: orderData } })
    }

    const handleDialogClose = () => {
        setOrderItems([]);
        // setOrderData(initialDialogState);
        props.handleClose();
    }

    const onDataChange = (data) => {
        setOrderData(data);
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


                </DialogTitle>
                <DialogContent>

                    <DialogAddOrderNewCustomer />
                    <DialogAddOrderData onChange={onDataChange} />
                    <DialogAddOrderItems />

                    <DialogContentText>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                
                    <Button onClick={handleDialogClose} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleAddOrder} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>



        </div>
    )
}

export default DialogAddOrder;