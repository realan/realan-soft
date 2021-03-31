import React from "react";
import { useState } from "react";
import DateButton from "components/DateButton/DateButton";
import ModalResorting from "ModalResorting/ModalResorting";
import AddItemInOrder from "components/AddItemInOrder/AddItemInOrder";
import OrderDocsButtons from "components/OrderButtonsGroup/OrderDocsButtons";
// import { DataGrid } from "@material-ui/data-grid";

const Orders = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState(new Date(today.getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState(today);

  const params ={row:{
    id: 16,
    bill_id: undefined,
    invoice_id: null,
    payment_status: null,
  }}
  // params.id = 16;
  // : {
  //   bill_id: null,
  //   invoice_id: null,
  //   payment_status: null,
  //   id: 16,
    
  // }

  const idOrder=16;

  return (
    <>
      <div>
        {"C "} <DateButton value={startDate} onChange={(date) => setStartDate(date)} />
        {"    По "}
        <DateButton value={endDate} onChange={(date) => setEndDate(date)} />
      </div>

      <ModalResorting startDate={startDate} endDate={endDate} />
      <AddItemInOrder orderId={181} />
      <OrderDocsButtons params={params} idOrder={idOrder}/>

    </>
  );
};

export default Orders;
