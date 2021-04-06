import React from "react";
import { useState, useEffect, useCallback } from "react";
import OrderData from "components/OrderData/OrderData";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

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

export default function UpdateOrder({ orderId }) {
  console.log("render UpdateOrder");
  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState({});

  const onOrderDataChange = useCallback(
    (type, value) => {
      console.log(orderData);
      setOrderData((prevState) => ({ ...prevState, [type]: value }));
    },
    [orderData]
  );

  const { loading, data } = useQuery(GET_ORDER_DATA, { variables: { order_id: orderId } });

  useEffect(() => {
    if (!loading && data) {
      // console.log(data);
      setOrderData(data.orders[0]);
      setOpen(true);
    }
  }, [loading, data]);

  if (loading) return <p>Loading order...</p>;

  const handleSubmit = () => {
    setOpen(false);
  };

  return (
    <>
      <OrderData
        open={open}
        onSubmit={handleSubmit}
        orderData={orderData}
        onChange={onOrderDataChange}
      />
    </>
  );
}
