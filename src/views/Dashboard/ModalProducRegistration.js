import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from "@material-ui/core/DialogTitle";
import { DataGrid } from "@material-ui/data-grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import FileExportToXls from "components/FileExportToXls/FileExportToXls";
import { useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const QUERY_GET_FROM_SUPPLIER = gql`
  query GetFromSupplier($startDate: timestamp!, $endDate: timestamp!) {
    moving(
      where: { created_at: { _gte: $startDate, _lte: $endDate }, from_order: { _eq: 2 } }
      order_by: { created_at: desc }
    ) {
      id
      created_at
      price {
        art
        name
      }
      qty
      note
    }
  }
`;

const ModalProducRegistration = ({ startDate, endDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "id", headerName: "id", width: 10 },
    { field: "name", headerName: "Название", width: 250 },
    { field: "art", headerName: "Артикул", width: 100 },
    { field: "qty", headerName: "К-во", width: 100 },
    { field: "date", headerName: "Дата коррекции", width: 250 },
    { field: "note", headerName: "Лоток/коробка", width: 250 },
  ];

  const [getResort, { loading, error, data }] = useLazyQuery(QUERY_GET_FROM_SUPPLIER, {
    variables: { startDate: startDate, endDate: endDate },
  });

  useEffect(() => {
    if (!loading && data) {
      console.log(data);

      const preparedRows = data.moving.map((item) => {
        return {
          id: item.id,
          name: item.price.name,
          art: item.price.art,
          date: item.created_at,
          qty: item.qty,
          note: item.note,
        };
      });
      setRows(preparedRows);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleOpen = () => {
    getResort();
    setIsOpen(true);
  };

  return (
    <>
      <Button color="primary" variant="outlined" onClick={handleOpen}>
        Приемка от Мрамолита
      </Button>
      <Dialog
        open={isOpen}
        fullWidth={true}
        maxWidth="md"
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title"></DialogTitle>

        <DialogContent>
          {Boolean(rows.length) && (
            <div style={{ height: 500, width: "100%" }}>
              <DataGrid rows={rows} columns={columns} rowHeight={32} />
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Box flexGrow={1}>
            <Button onClick={handleClose} color="primary">
              Отмена
            </Button>
          </Box>
          <FileExportToXls data={rows} name={"Приемка"} />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalProducRegistration;
