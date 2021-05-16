import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";

const EditItemInOrder = ({ value, onChange, onDelete, onCancel, onSubmit, open }) => {
  //
  const handleChange = (type) => (event) => {
    let val;
    type === "qty" ? (val = Number(event.target.value)) : (val = event.target.value);
    onChange(type, val);
  };

  return (
    <>
      <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title" maxWidth="sm">
        <DialogTitle id="form-dialog-title">{value.name} </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Кол-во"
            type="number"
            fullWidth
            value={value.qty}
            onChange={handleChange("qty")}
          />
          <TextField
            margin="dense"
            label="Примечание"
            type="text"
            fullWidth
            value={value.note || ""}
            onChange={handleChange("note")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Отмена
          </Button>
          <Button onClick={onDelete} color="secondary">
            Удалить
          </Button>
          <Button onClick={onSubmit} color="primary">
            Изменить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditItemInOrder;
