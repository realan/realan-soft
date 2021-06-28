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
import { UPDATE_ORDER, UPSERT_ITEMS } from "./orderConstants";
import ConfirmSnackbar from "components/ConfirmSnackbar/ConfirmSnackbar";

// const showConfirm = () => {
//   return <ConfirmSnackbar open={true} message={"Импотророро"} />;
// };

export default function UpdateOrder({ open, onClose, orderId }) {
  // console.log("render UpdateOrder");
  const [orderData, setOrderData] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);

  const [
    UpdateOrder,
    { loading: loadingUpdate, error: errorUpdate, data: dataUpdate },
  ] = useMutation(UPDATE_ORDER); //, { onCompleted: setOpenConfirm(true) });

  const [
    UpsertItems,
    { loading: loadingUpsertItems, error: errorUpsertItems, data: dataUpsertItems },
  ] = useMutation(UPSERT_ITEMS);

  const { loading, error, data: dataOrder } = useQuery(GET_ORDER_DATA, {
    variables: { order_id: orderId },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (dataUpdate) {
      console.log("Items", orderData.items);
      const addData = orderData.items.map((item) => {
        let price = 0;
        switch (orderData.price_type_id) {
          case 1:
            price = item.price_dealer;
            break;
          case 2:
            price = item.price_opt;
            break;
          case 3:
            price = item.price_retail;
            break;
        }
        return {
          id: item.id < 500 ? undefined : item.id,
          item_id: item.item_id,
          qty: item.qty,
          note: item.note,
          order_id: orderData.id,
          price_in: item.price_dealer,
          price_out: +(price * (1 - orderData.discount)).toFixed(2),
        };
      });
      console.log(addData);
      UpsertItems({ variables: { addData } });
    }
  }, [dataUpdate]);

  useEffect(() => {
    if (dataUpsertItems) {
      console.log("Items Upsert", dataUpsertItems);
      setOpenConfirm(true);
      onClose();
    }
  }, [dataUpsertItems]);

  useEffect(() => {
    if (dataOrder) {
      // console.log("order data query", dataOrder);
      setOrderData(dataOrder.orders[0]);
      const dateOut = new Date(dataOrder.orders[0].date_out);
      handleChange("date_out", dateOut);
      const pay_till_date = new Date(dataOrder.orders[0].pay_till_date);
      handleChange("pay_till_date", pay_till_date);
      // console.log("dataOrder", dataOrder);
      const items = dataOrder.orders[0].items.map((it) => {
        let discount = it.price.supplier.our_discount ? it.price.supplier.our_discount : 0;
        return {
          id: it.id,
          item_id: it.item_id,
          qty: it.qty,
          note: it.note,
          art: it.price.art,
          name: it.price.name,
          price_in: it.price.price_dealer * (1 - discount),
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
      handleChange("person_id", dataOrder.orders[0].person_id); // ??? по идее, этой строчки не нужно.
    }
  }, [dataOrder]);

  // const showConfirm = () => {
  //   setOpenConfirm(true);
  // };

  const handleChange = useCallback((type, value) => {
    // console.log(orderData);
    setOrderData((prevState) => ({ ...prevState, [type]: value }));
  }, []);

  if (loading) return <p>Loading order...</p>;
  if (error) return `Error! ${error.message}`;
  if (loadingUpdate) return <p>Updating order...</p>;
  if (errorUpdate) return `Error! ${errorUpdate.message}`;
  if (loadingUpsertItems) return <p>Updating items...</p>;
  if (errorUpsertItems) return `Error! ${errorUpsertItems.message}`;

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
        sum: +orderData.sum.toFixed(2),
        sum_in: +orderData.orderParams.sum_in.toFixed(2),
        weight: +orderData.orderParams.weight.toFixed(3),
      },
    });
    // onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      {dataOrder && (
        <Dialog
          open={open}
          //onClose={onClose}
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
                type="update"
              />
            )}
          </DialogContent>
        </Dialog>
      )}
      <ConfirmSnackbar
        open={openConfirm}
        message={"Обновил заказ"}
        onClose={() => setOpenConfirm(false)}
      />
    </>
  );
}
