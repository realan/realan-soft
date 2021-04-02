import React from "react";
import { useState, useEffect } from "react";
import InvoiceView from "components/ReporsDialog/InvoiceView";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { useLazyQuery } from "@apollo/react-hooks";
import { gql } from "@apollo/client";

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

export default function OrderDocsButtons({ params }) {
  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState(false);

  const [loadOrderData, { called, loading, data }] = useLazyQuery(GET_ORDER_DATA, {
    variables: { order_id: params.row.id },
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      console.log(params);
      const preparedData = data.orders.map((it) => {
        let listItems = it.items.map((item, key) => {
          let price = 0;
          params.row.price_type === 1
            ? (price = item.price.price_dealer)
            : params.row.price_type === 2
            ? (price = item.price.price_opt)
            : (price = item.price.price_retail);

          price = price * (1 - params.row.discount);
          return {
            id: key + 1,
            description: item.price.name,
            article: item.price.art,
            unitName: "шт.",
            unitCode: "796",
            typePackage: "",
            quantOnePlace: "",
            quantOfPlace: "",
            grossWeight: "",
            quantity: item.qty,
            priceBeforeTax: price,
            sumBeforeTax: price,
            taxRate: "--",
            taxSum: 0,
            sumTotal: price * item.qty,
          };
        });
        let obj = {
          supplier: it.firmByOurFirmId,
          shipper: it.firmByOurFirmId,
          consignee: it.firm,
          payer: it.firm,
          listItems: listItems,
        };
        return obj;
      });
      console.log(preparedData);
      //   setOrderData(preparedData);
    }
  }, [data, params]);

  if (called && loading) return <p>Loading ...</p>;

  const handleButtonClick = (type) => {
    if (type === "invoice") {
      loadOrderData();
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
