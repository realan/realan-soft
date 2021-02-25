import Checkout from "components/AddOrder/Checkout";
import React from "react";
import OrdersTable from "./DataView/OrdersTable";


const OrdersAll = () => {

  return (
    <>
      <Checkout />
      <OrdersTable/>
    </>
  );
};

export default OrdersAll;
