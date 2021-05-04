import * as React from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DocumentViewer from "reports/DocumentViewer";
// import invoiceData1 from "../../reports/invoiceTORG12Data.json";

const DocsDialogView = ({ open, onClose, onSubmit, data, template }) => {
  // const dataSample = invoiceData1;
  console.log("RENDER DocsDialogView");
  const docTemplate = {
    // userId: number;
    // projectId: number;
    // name: string;
    // numbered: boolean;
    // step?: number;
    // suffix?: string;
    // firstNumber?: number;
    // toNull?: string;
    filename: template,
    // data: DocTemplateDataType,
  };

  console.log("docs data", data);
  console.log("template", docTemplate.filename);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={true}
        // fullWidth={true}
        // maxWidth="md"
        // minWidth="lg"
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
          <Button onClick={onSubmit} color="primary" variant="contained">
            Провести документ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocsDialogView;
