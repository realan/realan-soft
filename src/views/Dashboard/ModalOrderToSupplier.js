import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
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

const QUERY_GET_UNORDERED = gql`
  query GetUnorderedItems {
    items(where: { is_ordered: { _eq: false } }) {
      item_id
      id
      note
      order_id
      qty
      order {
        city
        customer_id
        customer {
          name
        }
        date_out
      }
      price {
        supplier {
          id
          name
        }
        art
        name
        price_dealer
      }
    }
  }
`;

const ModalOrderToSupplier = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "id", headerName: "id", width: 10 },
    { field: "item_name", headerName: "Название", width: 250 },
    { field: "item_art", headerName: "Артикул", width: 100 },
    { field: "qty", headerName: "К-во", width: 100 },
    { field: "note", headerName: "Примечание", width: 200 },
    { field: "price", headerName: "Цена", width: 150 },
    { field: "date_out", headerName: "Дата отгрузки", width: 150 },
    { field: "order_id", headerName: "order_id", width: 100 },
    { field: "customer_name", headerName: "Заказчик", width: 250 },
    { field: "city", headerName: "Город", width: 250 },
    { field: "suppler_name", headerName: "Поставщик", width: 250 },
  ];

  const [getUnorderedItems, { loading, error, data }] = useLazyQuery(QUERY_GET_UNORDERED);

  useEffect(() => {
    if (!loading && data) {
      console.log(data);
      const preparedRows = data.items.map((item) => {
        return {
          id: item.id,
          item_name: item.price.name,
          item_art: item.price.art,
          price: item.price.price_dealer,
          qty: item.qty,
          note: item.note,
          date_out: new Date(item.order.date_out),
          order_id: item.order_id,
          customer_id: item.order.customer_id,
          customer_name: item.order.customer.name,
          city: item.order.city,
          suppler_id: item.price.supplier.id,
          suppler_name: item.price.supplier.name,
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
    getUnorderedItems();
    setIsOpen(true);
  };

  return (
    <>
      <Button color="primary" variant="outlined" onClick={handleOpen}>
        Заказать позиции
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
          <FileExportToXls data={rows} name={"Заказать"} />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalOrderToSupplier;
