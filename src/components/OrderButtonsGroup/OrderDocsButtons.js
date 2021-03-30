import React from "react";
import { useState, useEffect } from "react";
import InvoiceView from "components/ReporsDialog/InvoiceView";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import {  useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";


const GET_ORDER_DATA = gql`
  query GetOrderData ($order_id: Int!) {
    orders(where: {id: {_eq: $order_id}}) {
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


export default function OrderDocsButtons(params, idOrder) {
  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState(false);


  const { loading, error, data } = useQuery(GET_ORDER_DATA, {
    variables: { order_id: idOrder },
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      // const preparedData = data.orders.map((it, key) => {
      //   let obj = {
      //   };
      //   return obj;
      // });
      // console.log(preparedData);
      // setOrderData(preparedData);
    }
  }, [data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleButtonClick = (type) => {
    console.log(type);
    if (type === "invoice") {
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <ButtonGroup aria-label="button group" size="small">
        <Button
          id="bill"
          color={params.row.bill_id ? "primary" : "secondary"}
          onClick={(e) => handleButtonClick(e.currentTarget.id)}
        >
          Сч
        </Button>
        <Button
          id="invoice"
          color={params.row.invoice_id ? "primary" : "secondary"}
          onClick={(e) => handleButtonClick(e.currentTarget.id)}
        >
          Нк
        </Button>
        <Button
          id="payment"
          color={params.row.payment_status ? "primary" : "secondary"}
          onClick={(e) => handleButtonClick(e.currentTarget.id)}
        >
          Пл
        </Button>
      </ButtonGroup>
      <InvoiceView open={open} onClose={handleClose} data={orderData} /> 
    </>
  );
}
