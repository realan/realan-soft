import React from "react";
// import { useState } from "react";
import OrdersTable from "./DataView/OrdersTable";
import AddNewOrder from "components/OrderData/AddNewOrder";
// import UpdateOrder from "components/OrderData/UpdateOrder";

const OrdersAll = () => {
  return (
    <>
      <AddNewOrder />
      <OrdersTable />
    </>
  );
};

export default OrdersAll;
