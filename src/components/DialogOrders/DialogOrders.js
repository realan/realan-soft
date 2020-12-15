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


const GET_ORDERS_BY_ID = gql`
  query {
    mr_items(where: {item: {_eq: 1}, mr_order: {is_shipped: {_eq: false}}}) {
        order
        qty
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

    const { loading, error, data } = useQuery(GET_ORDERS_BY_ID);
    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;
  
    const dataTable = data.mr_items;
    console.log(dataTable)

    
    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.PaperhandleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Subscribe
                </DialogTitle>
                <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                    
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
