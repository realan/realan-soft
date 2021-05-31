import React from "react";
import OrdersTable from "./OrdersTable";
import NewOrder from "../Forms/OrderProcessing/NewOrder";

const OrdersManager = () => {
  return (
    <>
      <NewOrder />
      <OrdersTable />
    </>
  );
};

export default OrdersManager;
