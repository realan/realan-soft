import React from "react";
import { useState, useEffect } from "react";
import DocsDialogView from "components/DocsDialogView/DocsDialogView";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
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
      id
      city
      bill_id
      invoice_id
      discount
      our_firm_id
      price_type_id
      sum
    }
  }
`;

const GET_LAST_DOC_NUMBER = gql`
  query getLastDocNumber($year: Int!, $our_firm_id: Int!, $type_doc_id: Int!) {
    documents(
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
  mutation AddDocument($addData: documents_insert_input!) {
    insert_documents_one(object: $addData) {
      id
    }
  }
`;

const UPDATE_ORDER_BILL = gql`
  mutation UpdateOrderBill($id: Int!, $bill_id: Int!) {
    update_orders_by_pk(pk_columns: { id: $id }, _set: { bill_id: $bill_id }) {
      id
    }
  }
`;
const UPDATE_ORDER_INVOICE = gql`
  mutation UpdateOrderInvoice($id: Int!, $invoice_id: Int!) {
    update_orders_by_pk(pk_columns: { id: $id }, _set: { invoice_id: $invoice_id }) {
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

  const [loadOrderData, { called, loading, data }] = useLazyQuery(GET_ORDER_DATA, {
    variables: { order_id: params.row.id },
  });
  const [
    getLastDocNumber,
    { data: dataNumber, loading: loadingNumber, error: errorNumber },
  ] = useLazyQuery(GET_LAST_DOC_NUMBER, {
    variables: {
      year: docVars.year,
      our_firm_id: docVars.our_firm_id,
      type_doc_id: docVars.type_doc_id,
    },
    fetchPolicy: "network-only",
  });

  const [
    AddDocument,
    { data: dataDocument, loading: loadingDocument, error: errorDocument },
  ] = useMutation(ADD_DOCUMENT);

  const [UpdateOrderBill, { data: dataBill, loading: loadingBill, error: errorBill }] = useMutation(
    UPDATE_ORDER_BILL
  );
  const [
    UpdateOrderInvoice,
    { data: dataInvoice, loading: loadingInvoice, error: errorInvoice },
  ] = useMutation(UPDATE_ORDER_INVOICE);

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
          sum: it.sum,
          city: it.city,
          id: it.id,
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
    if (dataDocument) {
      console.log("dataDocument", dataDocument);
      if (typeDoc === 1) {
        UpdateOrderInvoice({
          variables: { id: orderData.id, invoice_id: dataDocument.insert_documents_one.id },
        });
        console.log("dataInvoice", dataInvoice);
        console.log("orderData.id", orderData.id);
      }
      if (typeDoc === 2) {
        UpdateOrderBill({
          variables: { id: orderData.id, bill_id: dataDocument.insert_documents_one.id },
        });
        console.log("dataBill", dataBill);
        console.log("orderData.id", orderData.id);
      }
    }
  }, [dataDocument, orderData.id]);

  useEffect(() => {
    if (dataNumber) {
      let number = 0;
      if (dataNumber.documents[0]) {
        number = dataNumber.documents[0].number;
      }
      console.log("number", number);
      setOrderData((prevState) => ({ ...prevState, number: number + 1 }));
    }
  }, [dataNumber]);

  if (called && loading) return <p>Loading ...</p>;
  if (loadingNumber) return <p>Loading Number ...</p>;
  if (errorNumber) return `Error! ${errorNumber.message}`;
  if (loadingDocument) return <p>Loading Document ...</p>;
  if (errorDocument) return `Error! ${errorDocument.message}`;
  if (loadingBill) return <p>Loading Bill ...</p>;
  if (errorBill) return `Error! ${errorBill.message}`;
  if (loadingInvoice) return <p>Loading Invoice ...</p>;
  if (errorInvoice) return `Error! ${errorInvoice.message}`;

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
    let date = new Date();
    let year = date.getFullYear();
    const preparedData = {
      date: date,
      our_firm_id: orderData.our_firm_id,
      type_doc_id: typeDoc,
      sum: orderData.sum,
      year: year,
      number: orderData.number,
    };
    AddDocument({ variables: { addData: preparedData } });

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
