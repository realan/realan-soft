import React from "react";
import { useState, useEffect, useCallback } from "react";
import Button from "@material-ui/core/Button";
// import Checkout from "components/AddOrder/Checkout";
import OrdersTable from "./DataView/OrdersTable";
import OrderData from "components/OrderData/OrderData";
import { gql } from "apollo-boost";
import { useLazyQuery } from "@apollo/react-hooks";

const GET_ORDER_DATA = gql`
  query GetOrderData($order_id: Int!) {
    orders(where: { id: { _eq: $order_id } }) {
      firm {
        id
        name
        inn
        kpp
        okpo
        address
        address_mail
        account
        management_name
        management_post
      }
      firmByOurFirmId {
        id
        ogrn
        name
        address
        address_mail
        account
        bank
        bic
        inn
        kpp
        management_name
        accountant_name
        management_post
      }
      items {
        qty
        price {
          id
          art
          name
          price_dealer
          price_opt
          price_retail
        }
      }
      city
      bill_id
      invoice_id
      discount
    }
  }
`;

const OrdersAll = () => {
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
  // const [orderId, setOrderId] = useState(undefined);

  const onOrderDataChange = useCallback(
    (type, value) => {
      console.log(orderData);
      setOrderData((prevState) => ({ ...prevState, [type]: value }));
    },
    [orderData]
  );

  const [getOrderData, { loading, data }] = useLazyQuery(GET_ORDER_DATA);

  const onRowClick = (row) => {
    console.log(orderData);
    getOrderData({ variables: { order_id: row.row.id } });
    console.log(row);
  };

  useEffect(() => {
    if (!loading && data) {
      // console.log(data);
      setOrderData(data.orders[0]);
    }
  }, [loading, data]);

  if (loading) return <p>Loading order...</p>;

  const handleSubmit = () => {
    setOpen(false);
  };

  return (
    <>
      {/* <Checkout /> */}
      <Button variant="outlined" color="primary" onClick={() => setOpen(!open)}>
        {open ? "Свернуть" : "Новый заказ"}
      </Button>
      <OrderData
        open={open}
        onSubmit={handleSubmit}
        orderData={orderData}
        onChange={onOrderDataChange}
      />
      <OrdersTable onRowClick={onRowClick} />
    </>
  );
};

export default OrdersAll;
