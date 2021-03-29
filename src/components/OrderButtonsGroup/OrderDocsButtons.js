import React from "react";
import { useState } from "react";
import InvoiceView from "components/ReporsDialog/InvoiceView";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

export default function OrderDocsButtons(params) {
  const handleButtonClick = (type, orderId) => {
    console.log(type, orderId);
    const [open, setOpen] = useState(false);
    const handleClose = () => {
      setOpen(false);
    };

    console.log(type, orderId);
    if (type === "invoice") {
      return <InvoiceView open={open} onClose={handleClose} />;
    }
  };

  return (
    <ButtonGroup aria-label="button group" size="small">
      <Button
        id="bill"
        color={params.row.bill_id ? "primary" : "secondary"}
        onClick={(e) => handleButtonClick(e.currentTarget.id, params.row.id)}
      >
        Сч
      </Button>
      <Button
        id="invoice"
        color={params.row.invoice_id ? "primary" : "secondary"}
        onClick={(e) => handleButtonClick(e.currentTarget.id, params.row.id)}
      >
        Нк
      </Button>
      <Button
        id="payment"
        color={params.row.payment_status ? "primary" : "secondary"}
        onClick={(e) => handleButtonClick(e.currentTarget.id, params.row.id)}
      >
        Пл
      </Button>
    </ButtonGroup>
  );
}
