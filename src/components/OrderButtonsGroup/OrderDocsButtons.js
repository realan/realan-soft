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

const GET_LAST_DOC_NUMBER = gql`
  query getLastDocNumber {
    register(
      where: { year: { _eq: 2021 }, our_firm_id: { _eq: 1 }, type_doc_id: { _eq: 1 } }
      limit: 1
      order_by: { number: desc }
    ) {
      number
    }
  }
`;

export default function OrderDocsButtons({ params }) {
  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState(false);
  const [templateDoc, setTemplateDoc] = useState("");
  // let date = new Date();
  // let year = date.getFullYear();

  const [loadOrderData, { called, loading, data }] = useLazyQuery(GET_ORDER_DATA, {
    variables: { order_id: params.row.id },
  });
  const [getLastDocNumber, { data: dataNumber, loading: loadingNumber }] = useLazyQuery(
    GET_LAST_DOC_NUMBER,
    {
      // variables: { year: year },
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (data) {
      // console.log(data);
      // console.log(params);
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
      console.log(preparedData[0]);
      setOrderData(preparedData[0]);
    }
  }, [data, params]);

  useEffect(() => {
    if (dataNumber) {
      setOrderData((prevState) => ({ ...prevState, number: dataNumber.register[0].number }));
    }
  }, [dataNumber]);

  if (called && loading) return <p>Loading ...</p>;
  if (loadingNumber) return <p>Loading ...</p>;

  const handleButtonClick = (event) => {
    console.log(event);
    const type = event.currentTarget.id;

    if (type === "invoice") {
      loadOrderData();
      getLastDocNumber();
      setTemplateDoc("ruInvoiceTORG12.mrt");
      setOpen(true);
    }
    if (type === "bill") {
      console.log(orderData);
      getLastDocNumber();
      setTemplateDoc("ruBill1.mrt");
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
          onClick={handleButtonClick}
        >
          Сч
        </Button>
        <Button
          id="invoice"
          color={params.row.invoice_id ? "primary" : "secondary"}
          onClick={handleButtonClick}
        >
          Нк
        </Button>
        <Button
          id="payment"
          color={params.row.payment_status ? "primary" : "secondary"}
          onClick={handleButtonClick}
        >
          Пл
        </Button>
      </ButtonGroup>
      {open && (
        <InvoiceView open={open} onClose={handleClose} data={orderData} template={templateDoc} />
      )}
    </>
  );
}
