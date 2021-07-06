import React, { useState } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Close from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const DELETE_MOVE = gql`
  mutation DeleteMove($id: Int!) {
    delete_moving_by_pk(id: $id) {
      id
    }
  }
`;
// const UPDATE_SUPPLY_ITEM = gql`
//   mutation DeleteMove($id: Int!) {
//     delete_moving_by_pk(id: $id) {
//       id
//     }
//   }
// `;

const DeleteMove = ({ value }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [DeteteMove] = useMutation(DELETE_MOVE);
  // const [UpdateSupplyItem] = useMutation(UPDATE_SUPPLY_ITEM);

  // console.log(value);
  const handleSubmit = () => {
    DeteteMove({ variables: { id: value.id } });
    setIsOpen(false);
  };

  const handleCancel = () => {
    console.log(value);
    setIsOpen(false);
  };

  return (
    <>
      <IconButton
        color="secondary"
        aria-label="delete-move"
        component="span"
        onClick={() => setIsOpen(true)}
      >
        <Close />
      </IconButton>

      <Dialog
        open={isOpen}
        onClose={handleCancel}
        aria-labelledby="form-dialog-delete-move"
        maxWidth="sm"
      >
        <DialogTitle id="form-dialog-delete-move">Удаляю проводку</DialogTitle>
        <DialogContent></DialogContent>
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
  );
};

export default DeleteMove;
