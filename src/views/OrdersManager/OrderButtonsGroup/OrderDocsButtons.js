import React from "react";
import { useState, useEffect } from "react";
import DocsDialogView from "components/DocsDialogView/DocsDialogView";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "@apollo/client";
import AddPaymentDialog from "views/Forms/AddPaymentDialog";

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
        corr_account
        management_name
        accountant_name
        management_post
      }
      items {
        id
        qty
        price_out
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
      date_out
      bill_id
      invoice_id
      profit_calc_id
      discount
      our_firm_id
      firm_id
      shop_id
      customer_id
      price_type_id
      sum
      sum_in
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

export const UPSERT_DOCUMENTS = gql`
  mutation UpsertDocument($addData: [documents_insert_input!]!) {
    insert_documents(
      objects: $addData
      on_conflict: {
        constraint: registr_pkey
        update_columns: [date, our_firm_id, firm_id, shop_id, customer_id, year, number, sum]
      }
    ) {
      returning {
        id
        type_doc_id
      }
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
const UPDATE_ORDER_PROFIT_CALC = gql`
  mutation UpdateOrderInvoice($id: Int!, $profit_id: Int!) {
    update_orders_by_pk(pk_columns: { id: $id }, _set: { profit_calc_id: $profit_id }) {
      id
    }
  }
`;

export default function OrderDocsButtons({ params }) {
  // console.log("params", params.row);
  const [open, setOpen] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
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
    UpsertDocuments,
    { data: dataUpsertDoc, loading: loadingUpsertDoc, error: errorUpsertDoc },
  ] = useMutation(UPSERT_DOCUMENTS);
  // const [
  //   AddDocument,
  //   { data: dataDocument, loading: loadingDocument, error: errorDocument },
  // ] = useMutation(ADD_DOCUMENT);

  const [UpdateOrderBill, { loading: loadingBill, error: errorBill }] = useMutation(
    UPDATE_ORDER_BILL
  );
  const [UpdateOrderInvoice, { loading: loadingInvoice, error: errorInvoice }] = useMutation(
    UPDATE_ORDER_INVOICE
  );
  const [UpdateOrderProfit, { loading: loadingProfit, error: errorProfit }] = useMutation(
    UPDATE_ORDER_PROFIT_CALC
  );

  // fetch order data
  useEffect(() => {
    if (!loading && data) {
      // console.log(data);
      // console.log(params);
      const preparedData = data.orders.map((it) => {
        let listItems = it.items.map((item, key) => {
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
            priceBeforeTax: item.price_out,
            sumBeforeTax: item.price_out,
            taxRate: "--",
            taxSum: 0,
            sumTotal: item.price_out * item.qty,
          };
        });
        let obj = {
          supplier: it.firmByOurFirmId,
          shipper: it.firmByOurFirmId,
          consignee: it.firm,
          payer: it.firm,
          our_firm_id: it.our_firm_id,
          firm_id: it.firm_id,
          customer_id: it.customer_id,
          shop_id: it.shop_id,
          listItems: listItems,
          sum: it.sum,
          sum_in: it.sum_in,
          city: it.city,
          order_id: it.id,
          bill: it.bill,
          bill_id: it.bill_id,
          profit_calc_id: it.profit_calc_id,
          invoice_id: it.invoice_id,
          invoice: it.invoice,
          date_out: it.date_out,
        };
        return obj;
      });
      console.log("order data", preparedData[0]);
      setOrderData(preparedData[0]);
      let objNumber = {
        year: new Date().getFullYear(),
        our_firm_id: preparedData[0].our_firm_id,
        type_doc_id: typeDoc,
      };
      setDocVars(objNumber);
      // Если нет документа - вычисляем номер для нового документа
      if (typeDoc === 1) {
        if (!orderData.invoice) {
          getLastDocNumber();
        }
      }
      if (typeDoc === 2) {
        if (!orderData.bill) {
          getLastDocNumber();
        }
      }
    }
  }, [data, typeDoc, params.row]);

  // update order data after document inserting - insert bill id or invoice id
  useEffect(() => {
    if (dataUpsertDoc) {
      console.log("dataUpsertDoc", dataUpsertDoc.insert_documents);
      dataUpsertDoc.insert_documents.returning.forEach((item) => {
        switch (item.type_doc_id) {
          case 1: // invoice
            UpdateOrderInvoice({
              variables: { id: orderData.order_id, invoice_id: item.id },
            });
            break;
          case 2: // bill
            UpdateOrderBill({
              variables: { id: orderData.order_id, bill_id: item.id },
            });
            break;
          case 4: // profit calc
            UpdateOrderProfit({
              variables: { id: orderData.order_id, profit_id: item.id },
            });
            break;
        }
      });
    }
  }, [dataUpsertDoc, orderData.id]);

  // задаем дату-номер документа
  useEffect(() => {
    if (dataNumber) {
      // console.log("DOCUMENT NUMBER", dataNumber);
      let number = 0;
      if (dataNumber.documents[0]) {
        number = dataNumber.documents[0].number;
      }
      if (typeDoc === 1) {
        let invoice = {
          date: new Date(orderData.date_out),
          number: number + 1,
        };
        // console.log("set invoice data", invoice);
        setOrderData((prevState) => ({ ...prevState, invoice: invoice }));
      }
      if (typeDoc === 2) {
        let bill = {
          date: new Date(),
          number: number + 1,
        };
        // console.log("set bill data", bill);
        setOrderData((prevState) => ({ ...prevState, bill: bill }));
      }
      // setOrderData((prevState) => ({ ...prevState, number: number + 1 }));
    }
  }, [dataNumber]);

  if (called && loading) return <p>Loading ...</p>;
  if (loadingNumber) return <p>Loading Number ...</p>;
  if (errorNumber) return `Error! ${errorNumber.message}`;
  if (loadingUpsertDoc) return <p>Loading Document ...</p>;
  if (errorUpsertDoc) return `Error! ${errorUpsertDoc.message}`;
  // if (loadingDocument) return <p>Loading Document ...</p>;
  // if (errorDocument) return `Error! ${errorDocument.message}`;
  if (loadingBill) return <p>Loading Bill ...</p>;
  if (errorBill) return `Error! ${errorBill.message}`;
  if (loadingInvoice) return <p>Loading Invoice ...</p>;
  if (errorInvoice) return `Error! ${errorInvoice.message}`;
  if (loadingProfit) return <p>Loading Profit ...</p>;
  if (errorProfit) return `Error! ${errorProfit.message}`;

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
  const handlePaymentClose = () => setOpenPayment(false);

  const handlePaymentButtonClick = () => {
    setOpenPayment(true);
  };

  const handleSubmit = () => {
    let addData = [];
    let date = new Date();
    let number = 0;
    let id = undefined;
    let profit_id = undefined;
    if (typeDoc === 1 && orderData.invoice) {
      id = orderData.invoice_id;
      date = orderData.invoice.date;
      number = orderData.invoice.number;
      // console.log("invoice", orderData.invoice);
    }
    if (typeDoc === 2 && orderData.bill) {
      id = orderData.bill_id;
      profit_id = orderData.profit_calc_id;
      date = orderData.bill.date;
      number = orderData.bill.number;
      // console.log("bill", date);
    }
    // console.log(orderData, date);
    let year = date.getFullYear();

    const preparedData = {
      //id: id,
      date: date,
      our_firm_id: orderData.our_firm_id,
      customer_id: orderData.customer_id,
      firm_id: orderData.firm_id,
      shop_id: orderData.shop_id,
      order_id: orderData.order_id,
      type_doc_id: typeDoc,
      sum: orderData.sum,
      year: year,
      number: number,
    };

    let profitData = {};
    if (typeDoc === 1) {
      profitData = {
        ...preparedData,
        type_doc_id: 4, // profit calc
        sum: preparedData.sum - orderData.sum_in,
      };
      if (profit_id) {
        profitData.id = profit_id;
      }
    }
    if (id) {
      preparedData.id = id;
    }

    addData.push(preparedData);
    if (profitData.type_doc_id) {
      addData.push(profitData);
    }

    console.log("addData", addData);
    console.log("orderData", orderData);
    UpsertDocuments({ variables: { addData } });

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
          onClick={handlePaymentButtonClick}
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
      {openPayment && (
        <AddPaymentDialog
          open={openPayment}
          onClose={handlePaymentClose}
          customerId={params.row.customerId}
          orderId={params.row.id}
          firmId={params.row.firm.id}
          ourFirmId={params.row.our_firm_id}
        />
      )}
    </>
  );
}
