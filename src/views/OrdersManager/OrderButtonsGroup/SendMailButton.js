import React from "react";
import { useState } from "react";
import Fab from "@material-ui/core/Fab";
import EmailIcon from "@material-ui/icons/Email";
import SendMailModal from "components/SendMail/SendMailModal";

export default function SendMailButton({ params }) {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  // console.log(params);
  return (
    <>
      <Fab
        color="primary"
        aria-label="update"
        size="small"
        component="span"
        onClick={() => setOpen(true)}
      >
        <EmailIcon />
      </Fab>

      {open && <SendMailModal open={open} onClose={handleClose} orderId={params.row.id} />}
    </>
  );
}
