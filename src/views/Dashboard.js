import React from "react";
import { useState } from "react";
import DateButton from "components/DateButton/DateButton";
import ModalResorting from "ModalResorting/ModalResorting";
import AddItemInOrder from "components/AddItemInOrder/AddItemInOrder";


const Orders = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState(new Date( today.getFullYear(), 0, 1 ));
  const [endDate, setEndDate] = useState(today);

  return (
    <>
      <div>
        {"C "} <DateButton value={startDate} onChange={(date) => setStartDate(date)} />
        {"    По "}<DateButton value={endDate} onChange={(date) => setEndDate(date)} />
      </div>

      <ModalResorting startDate={startDate} endDate={endDate} />
      <AddItemInOrder orderId={181}/>

    </>
  )
};

export default Orders;
