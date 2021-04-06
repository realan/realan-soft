import React from "react";
import { useState } from "react";
import OrdersTable from "./DataView/OrdersTable";
import AddNewOrder from "components/OrderData/AddNewOrder";
import UpdateOrder from "components/OrderData/UpdateOrder";

const OrdersAll = () => {
  const [update, setUpdate] = useState({
    open: false,
    orderId: undefined,
  });

  const onRowClick = (row) => {
    setUpdate({
      open: true,
      orderId: row.row.id,
    });
  };

  return (
    <>
      <AddNewOrder />
      {update.open && <UpdateOrder orderId={update.orderId} />}
      <OrdersTable onRowClick={onRowClick} />
    </>
  );
};

export default OrdersAll;
