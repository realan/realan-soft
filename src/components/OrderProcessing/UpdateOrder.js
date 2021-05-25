import React from "react";
import { useState, useEffect, useCallback } from "react";
// import OrderData from "components/OrderData/OrderData";
import OrderForm from "./OrderForm";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import Button from "@material-ui/core/Button";
// import Box from "@material-ui/core/Box";
import { GET_ORDER_DATA } from "./orderConstants";
import { UPDATE_ORDER } from "./orderConstants";

export default function UpdateOrder({ open, onClose, orderId }) {
  // console.log("render UpdateOrder");
  const [orderData, setOrderData] = useState({});

  const { loading, error, data } = useQuery(GET_ORDER_DATA, {
    variables: { order_id: orderId },
    fetchPolicy: "network-only",
  });
  const [UpdateOrder, { loading: loadingUpdate, error: errorUpdate }] = useMutation(UPDATE_ORDER);

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
      handleChange("person_id", data.orders[0].person_id); // ??? по идее, этой строчки не нужно.
    }
  }, [data]);

  const handleChange = useCallback((type, value) => {
    console.log(orderData);
    setOrderData((prevState) => ({ ...prevState, [type]: value }));
  }, []);

  if (loading) return <p>Loading order...</p>;
  if (error) return `Error! ${error.message}`;
  if (loadingUpdate) return <p>Updating order...</p>;
  if (errorUpdate) return `Error! ${errorUpdate.message}`;

  const handleSubmit = () => {
    console.log(orderData);
    UpdateOrder({
      variables: {
        id: orderData.id,
        address: orderData.address,
        bill_id: orderData.bill_id,
        city: orderData.city,
        consignee_data: orderData.consignee_data,
        consignee_name: orderData.consignee_name,
        consignee_phone: orderData.consignee_phone,
        customer_id: orderData.customer_id,
        date_in: orderData.date_in,
        date_out: orderData.date_out,
        delivery_id: orderData.delivery_id,
        delivery_note: orderData.delivery_note,
        discount: orderData.discount,
        firm_id: orderData.firm_id,
        invoice_id: orderData.invoice_id,
        is_cancelled: orderData.is_cancelled,
        is_shipped: orderData.is_shipped,
        note_order: orderData.note_order,
        note_supplier: orderData.note_supplier,
        our_firm_id: orderData.our_firm_id,
        packaging: orderData.packaging,
        pay_till_date: orderData.pay_till_date,
        payment_ratio: orderData.payment_ratio,
        payment_status: orderData.payment_status,
        person_id: orderData.person_id,
        price_type_id: orderData.price_type_id,
        shop_id: orderData.shop_id,
        sum: orderData.sum,
        weigth: orderData.weigth,
      },
    });
    onClose();
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
