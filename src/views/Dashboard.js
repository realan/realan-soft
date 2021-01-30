import React from "react";
import { useState } from "react";
import DateButton from "components/DateButton/DateButton";
import ModalResorting from "ModalResorting/ModalResorting";


const Orders = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState(new Date( today.getFullYear(), 0, 1 ));
  const [endDate, setEndDate] = useState(today);

  return (
    <div>
      <div>
        {"C "} <DateButton value={startDate} onChange={(date) => setStartDate(date)} />
        {"    По "}<DateButton value={endDate} onChange={(date) => setEndDate(date)} />
      </div>

      <ModalResorting startDate={startDate} endDate={endDate} />

    </div>
  )
};

export default Orders;
