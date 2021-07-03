import React from "react";
import { useState } from "react";
import DateButton from "components/DateButton/DateButton";
import SendMail from "components/SendMail/SendMail";
import moment from "moment";
import ModalOrderToSupplier from "./ModalOrderToSupplier";
import ModalCompleteSet from "views/Stock/ModalCompleteSet";

const Orders = () => {
  const [startDate, setStartDate] = useState(moment().startOf("isoWeek").toDate());
  const [endDate, setEndDate] = useState(new Date());

  return (
    <>
      <div>
        {"C "} <DateButton value={startDate} onChange={(date) => setStartDate(date)} />
        {"    По "}
        <DateButton value={endDate} onChange={(date) => setEndDate(date)} />
      </div>
      <ModalOrderToSupplier />
      <ModalCompleteSet />
      <SendMail />
    </>
  );
};

export default Orders;
