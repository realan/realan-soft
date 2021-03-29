import * as React from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DocumentViewer from "reports/DocumentViewer";
import invoiceData1 from "../../reports/invoiceTORG12Data.json";

const InvoiceView = ({ open, onClose }) => {
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
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth={true}
        maxWidth="md"
        minWidth="md"
        aria-labelledby="dialog-invoice"
      >
        <DialogContent>
          <DocumentViewer docTemplate={docTemplate} data={data} />
        </DialogContent>
        <DialogActions>
          <Box flexGrow={1}>
            <Button onClick={onClose} color="primary">
              Закрыть
            </Button>
          </Box>
          {/* <Button onClick={} color="primary">
            jhgkhg
          </Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InvoiceView;
