import React from 'react';
import { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { TextField } from '@material-ui/core';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const ADD_CUSTOMER = gql`
  mutation AddCustomer($addData: mr_customer_insert_input!) {
    insert_mr_customer(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const DialogAddOrderNewCustomer = () => {
  const initialState = {
    name: '',
    town: '',
    person: '',
    phone: '',
    email: '',
    delivery: '',
    discount: 0,
  };

  const [open, setOpen] = useState(false);
  const [state, setState] = useState(initialState);

  const [AddCustomer] = useMutation(ADD_CUSTOMER);

  const handleCancel = () => {
    setState(initialState);
    setOpen(false);
  };

  const handleOk = () => {
    if (state.name !== '') {
      AddCustomer({ variables: { addData: state } });
      setState(initialState);
    }
    setOpen(false);
  };

  const handleChange = (type) => (event) => {
    setState({ ...state, [type]: event.target.value });
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        Новый заказчик
      </Button>

      <Dialog
        open={open}
        onClose={handleCancel}
        fullWidth={true}
        maxWidth="xs"
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Новый заказчик
        </DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            onChange={handleChange('name')}
            value={state.name}
            label="Название"
          />
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            onChange={handleChange('town')}
            value={state.town}
            label="Город"
          />
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            onChange={handleChange('person')}
            value={state.person}
            label="Контактное лицо"
          />
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            onChange={handleChange('phone')}
            value={state.phone}
            label="Телефон"
          />
          <TextField
            variant="outlined"
            fullWidth
            type="email"
            onChange={handleChange('email')}
            value={state.email}
            label="email"
          />
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            onChange={handleChange('delivery')}
            value={state.delivery}
            label="ТК"
          />
          <TextField
            variant="outlined"
            fullWidth
            type="number"
            onChange={handleChange('discount')}
            value={state.discount}
            label="Скидка"
          />

          <DialogContentText></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Отмена
          </Button>
          <Button onClick={handleOk} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogAddOrderNewCustomer;
