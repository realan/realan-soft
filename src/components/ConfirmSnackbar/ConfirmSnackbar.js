import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
// import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ConfirmSnackbar({ open, message = "OK", type = "success", onClose }) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert severity={type} onClose={onClose}>
        <span style={{ whiteSpace: "pre-line" }}>{message}</span>
      </Alert>
    </Snackbar>
  );
}
