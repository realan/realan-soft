import React from "react";
import { useState } from "react";
import DateButton from "components/DateButton/DateButton";
import ModalResorting from "./ModalResorting";
import moment from "moment";
import ModalCompleteSet from "views/Stock/ModalCompleteSet";

const StockDashboard = () => {
  const [startDate, setStartDate] = useState(moment().startOf("isoWeek").toDate());
  const [endDate, setEndDate] = useState(new Date());

  return (
    <>
      <div>
        {"C "} <DateButton value={startDate} onChange={(date) => setStartDate(date)} />
        {"    По "}
        <DateButton value={endDate} onChange={(date) => setEndDate(date)} />
      </div>
      <ModalResorting startDate={startDate} endDate={endDate} />
      <ModalCompleteSet />
    </>
  );
};

export default StockDashboard;
