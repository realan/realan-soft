import React from "react";
import { useState, useEffect } from "react";
import DocsDialogView from "components/DocsDialogView/DocsDialogView";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { useLazyQuery, useMutations } from "@apollo/react-hooks";
import { gql } from "@apollo/client";

const GET_ORDER_DATA = gql`
  query GetOrderData($order_id: Int!) {
    orders(where: { id: { _eq: $order_id } }) {
      firm {
        id
        name
        address
        address_mail
        inn
        kpp
        okpo
        ogrn
        bic
        bank
        account
        management_name
        management_post
      }
      firmByOurFirmId {
        id
        name
        address
        address_mail
        inn
        kpp
        okpo
        ogrn
        bic
        bank
        account
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
      our_firm_id
      price_type_id
    }
  }
`;

const GET_LAST_DOC_NUMBER = gql`
  query getLastDocNumber($year: Int!, $our_firm_id: Int!, $type_doc_id: Int!) {
    register(
      where: {
        year: { _eq: $year }
        our_firm_id: { _eq: $our_firm_id }
        type_doc_id: { _eq: $type_doc_id }
      }
      limit: 1
      order_by: { number: desc }
    ) {
      number
    }
  }
`;

const ADD_DOCUMENT = gql`
  mutation AddDocument($addData: register_insert_input!) {
    insert_register_one(object: $addData}) {
      id
    }
  }
`;
const UPDATE_ORDER = gql`
  mutation UpdateOrder($addData: register_insert_input!) {
    insert_register_one(object: $addData}) {
      id
    }
  }
`;

export default function OrderDocsButtons({ params }) {
  // console.log("render docs buttons");
  const [open, setOpen] = useState(false);
  const [typeDoc, setTypeDoc] = useState(undefined);
  const [orderData, setOrderData] = useState(false);
  const [templateDoc, setTemplateDoc] = useState("");
  const [docVars, setDocVars] = useState({
    year: 2021,
    our_firm_id: 1,
    type_doc_id: 1,
  });
  // let date = new Date();
  // let year = date.getFullYear();

  const [loadOrderData, { called, loading, data }] = useLazyQuery(GET_ORDER_DATA, {
    variables: { order_id: params.row.id },
  });
  const [getLastDocNumber, { data: dataNumber, loading: loadingNumber, error }] = useLazyQuery(
    GET_LAST_DOC_NUMBER,
    {
      variables: {
        year: docVars.year,
        our_firm_id: docVars.our_firm_id,
        type_doc_id: docVars.type_doc_id,
      },
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (!loading && data) {
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
          // console.log(params.row.discount);
          price = price * (1 - params.row.discount);
          // console.log(price);
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
          our_firm_id: it.our_firm_id,
          listItems: listItems,
        };
        return obj;
      });
      console.log(preparedData[0]);
      setOrderData(preparedData[0]);
      let objNumber = {
        year: 2021,
        our_firm_id: preparedData[0].our_firm_id,
        type_doc_id: typeDoc,
      };
      setDocVars(objNumber);
      getLastDocNumber();
    }
  }, [data, params.row]);

  useEffect(() => {
    if (dataNumber) {
      let number = 1;
      if (dataNumber.register[0]) {
        number = dataNumber.register[0].number;
      }
      // console.log(number);
      setOrderData((prevState) => ({ ...prevState, number: number }));
    }
  }, [dataNumber]);

  if (called && loading) return <p>Loading ...</p>;
  if (loadingNumber) return <p>Loading Number ...</p>;
  if (error) return `Error! ${error.message}`;

  const handleButtonClick = (event) => {
    const type = event.currentTarget.id;
    if (type === "invoice") {
      loadOrderData();
      setTemplateDoc("torg12.mrt");
      setTypeDoc(1);
    }
    if (type === "bill") {
      loadOrderData();
      setTemplateDoc("bill.mrt");
      setTypeDoc(2);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    setOpen(false);
  };

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
        <DocsDialogView
          open={open}
          onClose={handleClose}
          onSubmit={handleSubmit}
          data={orderData}
          template={templateDoc}
        />
      )}
    </>
  );
}
