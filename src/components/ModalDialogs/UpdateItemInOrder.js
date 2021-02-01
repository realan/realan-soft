  
import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";

const UpdateItemInOrder = ({
        isOpen, 
        count,
        text,
        name,
        handleClose, 
        handleOk, 
        handleChange
    }) => {

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