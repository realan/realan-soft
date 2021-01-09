import React from 'react';
import { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputWithButtons from 'components/InputWithButtons/InputWithButtons';
import Button from '@material-ui/core/Button';
import { ADD_MOVE_ITEM } from '../../GraphQL/Mutations';

const DialogStockCorrectQty = (props) => {
  // itemId, Name, stockNow, open, handleClose
  // onSubmit - useMutation
  const [count, setCount] = useState(0);

  const [AddMove] = useMutation(ADD_MOVE_ITEM);

  const handleOK = () => {
    const addData = {
      qty: count - props.stockNow,
      to_order: 3, // склад - для расчета точного количества
      from_order: 5, // ID = 5 - корректировки склада
      item: props.itemId,
    };
    AddMove({ variables: { addData: addData } });
    props.handleClose(count);
  };
  const onChange = (val) => {
    setCount(val);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="sm"
    >
      <DialogTitle id="form-dialog-title">
        {props.name} - числится - {props.stockNow}{' '}
      </DialogTitle>
      <DialogContent>
        По факту
        <InputWithButtons onChange={onChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
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
