import React, {useState} from "react";
import { useMutation } from "@apollo/react-hooks";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Close from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { ADD_MOVE_ITEM } from "../../GraphQL/Mutations";
import { DELETE_ITEM_FROM_ORDER } from "../../GraphQL/Mutations";


const DeleteItemFromOrder = ({ value }) => {
  // console.log("render DeleteItemFromOrder")
    const [isOpen, setIsOpen] = useState(false);

    const [DeteteItemMutation] = useMutation(DELETE_ITEM_FROM_ORDER);
    const [AddMoveItemMutation] = useMutation(ADD_MOVE_ITEM);

    const handleSubmit = () => {
        DeteteItemMutation({ variables: { id: value.idDb } });
        let qty = value.qtyCollect;
        if (qty !== 0) {
          const addData = {
            qty: qty,
            to_order: 3, // id = 3 - склад
            from_order: value.to_order,
            item: value.idItem,
          };
          console.log(addData)
          AddMoveItemMutation({ variables: { addData: addData } });
        }
        setIsOpen(false);
      };
    
    //   const posDelete = (value) => {
    //     onePosDelete(value);
    //   };

    const handleCancel = () => {
        console.log(value)
        setIsOpen(false);
      };

    return (
        <>    
            <IconButton
                color="primary"
                aria-label="редактировать"
                component="span"
                onClick={ () => setIsOpen(true) }
            >
                <Close />
            </IconButton>

            <Dialog
                open={isOpen}
                onClose={handleCancel}
                aria-labelledby="form-dialog-title"
                maxWidth="sm"
            >
                <DialogTitle id="form-dialog-title">{value.name} -  удаляю позицию, что набрано - переместить на склад</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Заказано"
                        type="number"
                        fullWidth
                        disabled
                        value={value.qtyOrder}
                        //onChange={handleChange("qty")}
                    />
                    <TextField
                        margin="dense"
                        label="Набрано"
                        type="number"
                        fullWidth
                        disabled
                        value={value.qtyCollect}
                        //onChange={handleChange("qty")}
                    />
                    <TextField
                        margin="dense"
                        label="Примечание"
                        type="text"
                        fullWidth
                        disabled
                        value={value.note || ""}
                        //onChange={handleChange("note")}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Удалить
                </Button>
                </DialogActions>
            </Dialog>

      </>
    )
}

export default DeleteItemFromOrder;

