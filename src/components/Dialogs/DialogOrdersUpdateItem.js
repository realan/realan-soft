import React from "react";
import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { UPDATE_ITEM_IN_ORDER } from "../../GraphQL/Mutations";


const DialogOrdersUpdateItem= ({isOpen, value, handleClose}) => {
  console.log(value);
    const val=value;
    const [state, setState] = useState({
      count: val.qtyOrder,
      text: val.note || "",
      flag: false,
    });

    const [UpdateMutation] = useMutation(UPDATE_ITEM_IN_ORDER);

    const handleOk = () => {
      if (state.flag) {
        const data = {
          id: value.id,
          qty: state.count,
          note: state.text,
        };
        UpdateMutation({ variables: data });
      }
      handleClose();
    }

    const onCountChange = (event) => {
      setState( {
        ...state, 
        count: event.target.value,
        flag:true,
          
      })
    }

    const onTextChange = (event) => {
      setState( {
        ...state, 
        text: event.target.value,
        flag:true,
          
      })
    }

    return (
        <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        >
        <DialogTitle id="form-dialog-title">{value.name}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Кол-во"
              type="number"
              fullWidth
              value={state.count}
              onChange={onCountChange}
            />
            <TextField
              margin="dense"
              label="Примечание"
              type="text"
              fullWidth
              value={state.text}
              onChange={onTextChange}
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
}


export default DialogOrdersUpdateItem;
