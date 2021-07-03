import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";

const UPDATE_ITEM_IN_ORDER = gql`
  mutation UpdateMoving($id: Int!, $qty: Int!, $note: String) {
    update_moving_by_pk(pk_columns: { id: $id }, _set: { note: $note, qty: $qty }) {
      id
    }
  }
`;

const UpdateMove = ({ value }) => {
  // console.log(value);
  const initialState = {
    id: value.id,
    qty: value.qty,
    note: value.note,
  };
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(initialState);
  const [UpdateMutation] = useMutation(UPDATE_ITEM_IN_ORDER);

  const handleChange = (type) => (event) => {
    // console.log(type, event);
    setState({ ...state, [type]: event.target.value });
  };
  const handleCancel = () => {
    // console.log(value);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    console.log(state);
    UpdateMutation({
      variables: {
        id: state.id,
        note: state.note,
        qty: state.qty,
      },
    });
    setIsOpen(false);
  };

  return (
    <>
      <IconButton
        color="primary"
        aria-label="редактировать"
        component="span"
        onClick={() => setIsOpen(true)}
      >
        <EditIcon />
      </IconButton>

      <Dialog
        open={isOpen}
        onClose={handleCancel}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
      >
        <DialogTitle id="form-dialog-title">{value.name} </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Кол-во"
            type="number"
            fullWidth
            value={state.qty}
            onChange={handleChange("qty")}
          />
          <TextField
            margin="dense"
            label="Примечание (лоток/коробка)"
            type="text"
            fullWidth
            value={state.note || ""}
            onChange={handleChange("note")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Отмена
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Изменить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateMove;
