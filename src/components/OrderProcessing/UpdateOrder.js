import React from "react";
import { useState, useEffect, useCallback } from "react";
// import OrderData from "components/OrderData/OrderData";
import OrderForm from "./OrderForm";
import { useQuery } from "@apollo/react-hooks";
import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import Button from "@material-ui/core/Button";
// import Box from "@material-ui/core/Box";
import { GET_ORDER_DATA } from "./orderConstants";

export default function UpdateOrder({ open, onClose, orderId }) {
  // console.log("render UpdateOrder");
  const [orderData, setOrderData] = useState({});

  const { loading, error, data } = useQuery(GET_ORDER_DATA, { variables: { order_id: orderId } });

  useEffect(() => {
    if (data) {
      console.log("update order data", data);
      setOrderData(data.orders[0]);
      const dateOut = new Date(data.orders[0].date_out);
      handleChange("date_out", dateOut);
      const items = data.orders[0].items.map((it) => {
        return {
          id: it.id,
          item_id: it.item_id,
          qty: it.qty,
          note: it.note,
          art: it.price.art,
          name: it.price.name,
          price_dealer: it.price.price_dealer,
          price_opt: it.price.price_opt,
          price_retail: it.price.price_retail,
          weight: it.price.weight,
        };
      });
      handleChange("items", items);
      const orderParams = {
        sum_dealer: 0,
        sum_opt: 0,
        sum_retail: 0,
      };
      handleChange("orderParams", orderParams);
    }
  }, [data]);

  const handleChange = useCallback((type, value) => {
    // console.log(orderData);
    setOrderData((prevState) => ({ ...prevState, [type]: value }));
  }, []);

  if (loading) return <p>Loading order...</p>;
  if (error) return `Error! ${error.message}`;

  const handleSubmit = () => {
    // setOpen(false);
  };
  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      {data && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth={false}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle id="draggable-dialog-title">Скорректировать заказ</DialogTitle>
          <DialogContent>
            {orderData.id && (
              <OrderForm
                orderData={orderData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
