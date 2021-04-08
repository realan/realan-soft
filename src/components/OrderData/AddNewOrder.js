import React from "react";
import { useState, useCallback } from "react";
import Button from "@material-ui/core/Button";
import OrderData from "components/OrderData/OrderData";

export default function AddNewOrder() {
  const initialState = {
    customer_id: undefined,
    firm_id: undefined,
    shop_id: undefined,
    person_id: undefined,
    customer: { name: undefined },
    items: [],
    sum: 0,
  };
  const [orderData, setOrderData] = useState(initialState);
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    setOpen(false);
  };

  const onOrderDataChange = useCallback(
    (type, value) => {
      console.log(orderData);
      setOrderData((prevState) => ({ ...prevState, [type]: value }));
    },
    [orderData]
  );

  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => setOpen(!open)}>
        {open ? "Свернуть" : "Новый заказ"}
      </Button>
      {open && (
        <OrderData onSubmit={handleSubmit} orderData={orderData} onChange={onOrderDataChange} />
      )}
    </>
  );
}
