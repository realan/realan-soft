import React from "react";
import { useState } from "react";
import UpdateOrder from "components/OrderProcessing/UpdateOrder";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";

export default function EditOrderButton({ params }) {
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
        <EditIcon />
      </Fab>

      {open && <UpdateOrder open={open} onClose={handleClose} orderId={params.row.id} />}
    </>
  );
}
