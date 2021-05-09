import React from "react";
import OrdersTable from "./DataView/OrdersTable";
import NewOrder from "components/OrderProcessing/NewOrder";

const OrdersAll = () => {
  return (
    <>
      <NewOrder/>
      <OrdersTable />
    </>
  );
};

export default OrdersAll;
