  
import React from "react";
// import { useState } from "react";
// import { useMutation } from "@apollo/react-hooks";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
// import { UPDATE_ITEM_IN_ORDER } from "../../GraphQL/Mutations";


const UpdateItemInOrder = ({
        isOpen, 
        count,
        text,
        name,
        handleClose, 
        handleOk, 
        handleChange
    }) => {

    // console.log(value);
    // const val=value;
    // const [state, setState] = useState({
    //   count: val.qtyOrder,
    //   text: val.note || "",
    //   flag: false,
    // });

    // const [UpdateMutation] = useMutation(UPDATE_ITEM_IN_ORDER);

    // const handleOk = () => {
    //   if (state.flag) {
    //     const data = {
    //       id: value.id,
    //       qty: count,
    //       note: text,
    //     };
    //     UpdateMutation({ variables: data });
    //   }
    //   handleClose();
    // }

    // const handleChange = (event, type) => {
    //   setState( {
    //     ...state, 
    //     count: event.target.value,
    //     flag:true,
          
    //   })
    // }

    // const handleChange = (event, type) => {
    //   setState( {
    //     ...state, 
    //     text: event.target.value,
    //     flag:true,
          
    //   })
    // }

    return (
        <>
            <IconButton
            color="primary"
            aria-label="редактировать"
            component="span"
            onClick={handleOk}
            >
                <EditIcon />
            </IconButton>

            <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="sm"
            >
            <DialogTitle id="form-dialog-title">{name}</DialogTitle>
            <DialogContent>
                <TextField
                autoFocus
                margin="dense"
                label="Кол-во"
                type="number"
                fullWidth
                value={count}
                onChange={({ target }) => handleChange(target.value, "count")}
                />
                <TextField
                margin="dense"
                label="Примечание"
                type="text"
                fullWidth
                value={text}
                onChange={({ target }) => handleChange(target.value, "text")}
                />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Отмена
            </Button>
            <Button onClick={handleOk} color="primary">
                Изменить
            </Button>
            </DialogActions>
        </Dialog>
        );
    </>
    )
}


export default UpdateItemInOrder;