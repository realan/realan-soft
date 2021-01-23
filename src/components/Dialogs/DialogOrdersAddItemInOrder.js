import React from "react";
import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputWithButtons from "components/InputWithButtons/InputWithButtons";
import Button from "@material-ui/core/Button";
import { ADD_ITEM } from "../../GraphQL/Mutations";
import { GET_PRICE } from "../../GraphQL/Queries";


const DialogOrdersAddItemInOrder = ({isOpen}) => {
    const [price, setPrice] = useState([]);
    const [items, setItems] = useState([]);

    const { loading, error, data } = useQuery(GET_PRICE);

    useEffect(() => {
      if (!loading && data) {
        setPrice(data.mr_price);
      }
    }, [loading, data]);
  
    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;

    return (
        <Dialog
        open={openAddItem}
        onClose={handleAddItemClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        >
        <DialogTitle id="form-dialog-title">Добавить позицию </DialogTitle>
          <DialogContent>





            <TextField
              autoFocus
              margin="dense"
              label="Кол-во"
              type="number"
              fullWidth
              value={dataRow.qtyOrder}
              onChange={handleQtyChange}
            />
            <TextField
              margin="dense"
              label="Примечание"
              type="text"
              fullWidth
              value={dataRow.note || ""}
              onChange={handleNoteChange}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleUpdateItem} color="primary">
            Изменить
          </Button>
        </DialogActions>
      </Dialog>
    );
}


export default DialogOrdersAddItemInOrder;