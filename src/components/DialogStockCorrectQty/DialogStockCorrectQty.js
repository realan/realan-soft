import React from "react";
import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputWithButtons from "components/InputWithButtons/InputWithButtons";
import Button from "@material-ui/core/Button";
import { ADD_MOVES_ITEMS } from "../../GraphQL/Mutations";

const DialogStockCorrectQty = ({ open, itemId, name, stockNow, handleClose }) => {
  const [count, setCount] = useState(0);

  const [AddMove] = useMutation(ADD_MOVES_ITEMS);

  const handleOK = () => {
    if (stockNow !== count) {
      const addData = [
        {
          qty: count - stockNow,
          to_order: 3, // склад - для расчета точного количества
          from_order: 5, // ID = 5 - корректировки склада
          item_id: itemId,
        },
      ];
      console.log(addData);
      AddMove({ variables: { addData: addData } });
      handleClose(count);
    }
  };

  const onChange = (val) => {
    setCount(val);
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm">
      <DialogTitle id="form-dialog-title">
        {name} - числится - {stockNow}{" "}
      </DialogTitle>
      <DialogContent>
        По факту
        <InputWithButtons onChange={onChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(stockNow)} color="primary">
          Отмена
        </Button>
        <Button onClick={handleOK} color="primary">
          Изменить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogStockCorrectQty;
