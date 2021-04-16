import React from "react";
// import { useState } from "react";
import OrdersTable from "./DataView/OrdersTable";
import AddNewOrder from "components/OrderData/AddNewOrder";
import TryButton from "components/OrderData/TryButton";
// import UpdateOrder from "components/OrderData/UpdateOrder";

const OrdersAll = () => {
  return (
    <>
      <TryButton />
      <AddNewOrder />
      <OrdersTable />
    </>
  );
};

export default OrdersAll;
