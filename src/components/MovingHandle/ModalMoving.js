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
import UpdateMove from "./UpdateMove";
import DeleteMove from "./DeleteMove";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const QUERY_GET_MOVING = gql`
  query GetMoving($startDate: timestamp!, $endDate: timestamp!) {
    moving(
      where: { created_at: { _gte: $startDate, _lte: $endDate } }
      order_by: { created_at: desc }
    ) {
      id
      created_at
      price {
        art
        name
      }
      from_order
      to_order
      qty
      note
      toOrder {
        customer_id
        city
        consignee_name
      }
      fromOrder {
        customer_id
        city
        consignee_name
      }
    }
  }
`;

function updateField(params) {
  return <UpdateMove value={params.row} />;
}
function deleteField(params) {
  return <DeleteMove value={params.row} />;
}

const ModalMoving = ({ startDate, endDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "id", headerName: "id", width: 100 },
    { field: "date", headerName: "Дата", width: 150 },
    { field: "name", headerName: "Название", width: 250 },
    { field: "art", headerName: "Артикул", width: 100 },
    { field: "qty", headerName: "К-во", width: 100 },
    { field: "note", headerName: "Лоток/коробка", width: 200 },
    { field: "from_customer", headerName: "Из", width: 200 },
    { field: "to_customer", headerName: "В", width: 200 },
    { field: "from_order", headerName: "Из id", width: 100 },
    { field: "to_order", headerName: "В id", width: 100 },
    { field: "update", headerName: "Обновить", width: 80, renderCell: updateField },
    { field: "delete", headerName: "Удалить", width: 80, renderCell: deleteField },
  ];

  const [getMovings, { loading, error, data }] = useLazyQuery(QUERY_GET_MOVING, {
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
          date: new Date(item.created_at),
          qty: item.qty,
          note: item.note,
          to_order: item.to_order,
          from_order: item.from_order,
          from_customer: item.fromOrder.consignee_name,
          to_customer: item.toOrder.consignee_name,
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
    getMovings();
    setIsOpen(true);
  };

  return (
    <>
      <Button color="primary" variant="outlined" onClick={handleOpen}>
        Движения по складу
      </Button>
      <Dialog
        open={isOpen}
        fullWidth={true}
        fullScreen={true}
        maxWidth="md"
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title"></DialogTitle>

        <DialogContent>
          {Boolean(rows.length) && (
            <div style={{ height: 900, width: "100%" }}>
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
          <FileExportToXls data={rows} name={"Движения по складу"} />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalMoving;
