// import StimulsoftViewer from "components/StimulsoftViewer/StimulsoftViewer";
import * as React from "react";
import DocumentViewer from "reports/DocumentViewer";
import invoiceData1 from "../reports/invoiceTORG12Data.json";
// import billData1 from '../reports/billData1.json';

const Invoice = () => {
  const data = invoiceData1;

  const docTemplate = {
    // userId: number;
    // projectId: number;
    // name: string;
    // numbered: boolean;
    // step?: number;
    // suffix?: string;
    // firstNumber?: number;
    // toNull?: string;
    filename: "ruInvoiceTORG12.mrt",
    // data: DocTemplateDataType,
  };

  return (
    <>
      <DocumentViewer docTemplate={docTemplate} data={data} />
    </>
  );
};

export default Invoice;
