import React from "react";
import OrdersTable from "./OrdersTable";
import NewOrder from "../Forms/OrderProcessing/NewOrder";
import AddCustomerDialog from "views/Forms/AddCustomerDialog";

const OrdersManager = () => {
  return (
    <>
      <AddCustomerDialog />
      <NewOrder />
      <OrdersTable />
    </>
  );
};

export default OrdersManager;
