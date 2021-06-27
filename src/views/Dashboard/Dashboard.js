import React from "react";
import { useState } from "react";
import DateButton from "components/DateButton/DateButton";
import SendMail from "components/SendMail/SendMail";
import ModalResorting from "./ModalResorting";
import moment from "moment";
import ModalProducRegistration from "./ModalProducRegistration";
// import AddCustomerForm from "views/Forms/AddCustomerForm";

const Orders = () => {
  // const today = new Date();
  const [startDate, setStartDate] = useState(moment().startOf("isoWeek").toDate());
  // const [startDate, setStartDate] = useState(new Date(today.getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState(new Date());

  return (
    <>
      <div>
        {"C "} <DateButton value={startDate} onChange={(date) => setStartDate(date)} />
        {"    По "}
        <DateButton value={endDate} onChange={(date) => setEndDate(date)} />
      </div>

      <ModalProducRegistration startDate={startDate} endDate={endDate} />
      <ModalResorting startDate={startDate} endDate={endDate} />
      <SendMail />
    </>
  );
};

export default Orders;
