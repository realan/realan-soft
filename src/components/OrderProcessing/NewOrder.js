import React from "react";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import OrderForm from "./OrderForm";
import { newOrderFormState } from "./orderConstants";
import { ADD_ORDER } from "./orderConstants";
import { ADD_ITEMS } from "./orderConstants";

export default function NewOrder() {
  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState(newOrderFormState);
  const [AddOrder, { loading, error, data }] = useMutation(ADD_ORDER);
  const [AddItems, { loading: loadingItems, error: errorItems }] = useMutation(ADD_ITEMS);

  useEffect(() => {
    if (!loading && data) {
      // console.log(data);
      // console.log(orderData);
      const items = orderData.items.map((it) => {
        const obj = {
          item_id: it.item_id,
          qty: it.qty,
          order_id: data.insert_orders_one.id,
          note: it.note,
        };
        return obj;
      });
      // console.log(items);
      if (items.length > 0) {
        AddItems({ variables: { addData: items } });
      }
      setOrderData(newOrderFormState);
      setOpen(false);
    }
  }, [loading, data]);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  if (loadingItems) return "loadingItems...";
  if (errorItems) return `Error! ${errorItems.message}`;

  const handleChange = (type, value) => {
    // console.log("orderData", orderData);
    setOrderData((prevState) => ({ ...prevState, [type]: value }));
  };

  const handleSubmit = () => {
    const order = {
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
    };
    // console.log(order);
    AddOrder({ variables: { addData: order } });
  };

  const handleCancel = () => {
    setOrderData(newOrderFormState);
    // setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => setOpen(!open)}>
        {open ? "Свернуть" : "Новый заказ"}
      </Button>
      {open && (
        <OrderForm
          orderData={orderData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
