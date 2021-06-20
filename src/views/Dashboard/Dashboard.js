import React from "react";
import { useState } from "react";
import DateButton from "components/DateButton/DateButton";
import SendMail from "components/SendMail/SendMail";
import ModalResorting from "./ModalResorting";
// import AddCustomerForm from "views/Forms/AddCustomerForm";

const Orders = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState(new Date(today.getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState(today);

  // const params = {
  //   row: {
  //     id: 16,
  //     bill_id: undefined,
  //     invoice_id: null,
  //     payment_status: null,
  //     price_type: 1,
  //     discount: 0.04,
  //   },
  // };

  return (
    <>
      <div>
        {"C "} <DateButton value={startDate} onChange={(date) => setStartDate(date)} />
        {"    По "}
        <DateButton value={endDate} onChange={(date) => setEndDate(date)} />
      </div>
      <SendMail />

      <ModalResorting startDate={startDate} endDate={endDate} />
    </>
  );
};

export default Orders;
