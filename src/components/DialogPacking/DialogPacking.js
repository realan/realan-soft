import React from "react";
import { gql } from "apollo-boost";
import { useState, useMemo, useEffect } from "react";
import { useSubscription } from "@apollo/react-hooks";
import { DataGrid } from "@material-ui/data-grid";
import Pagination from "@material-ui/lab/Pagination";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { QuantityChanger } from "components/QuantityChanger";
import BoxNumberButtons from "./BoxNumberButtons";
import { Box } from "@material-ui/core";
// import StockTableChoise from "components/StockTableChoise/StockTableChoise";
// import VoiceInput from "components/VoiceInput/VoiceInput";
// import { Box } from "@material-ui/core";
// import FileExportToXls from "components/FileExportToXls/FileExportToXls";
// import TextField from "@material-ui/core/TextField";
// import { withStyles } from "@material-ui/core/styles";
// import { XGrid } from '@material-ui/x-grid';

const SUBSCRIPTION_ITEMS = gql`
  subscription($order_id: Int!) {
    items(where: { order_id: { _eq: $order_id } }, order_by: { price: { id: asc } }) {
      id
      item_id
      note
      qty
      price {
        art
        name_voice
        weight
        price_dealer
        qty_from: movings_aggregate(where: { from_order: { _eq: $order_id } }) {
          aggregate {
            sum {
              qty
            }
          }
        }
        qty_to: movings_aggregate(where: { to_order: { _eq: $order_id } }) {
          aggregate {
            sum {
              qty
            }
          }
        }
        qty_from_collected: packing_moves_aggregate(where: { from_box_id: { _eq: $order_id } }) {
          aggregate {
            sum {
              qty
            }
          }
        }
        qty_to_collected: packing_moves_aggregate(where: { to_box_id: { _eq: $order_id } }) {
          aggregate {
            sum {
              qty
            }
          }
        }
      }
    }
  }
`;

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
});

function PackToBox(params) {
  return (
    <Button color="primary" variant="contained">
      Упаковать
    </Button>
  );
}

function CustomPagination(props) {
  const { pagination, api } = props;
  const classes = useStyles();

  return (
    <Pagination
      className={classes.root}
      boundaryCount={50}
      size="large"
      siblingCount={3}
      color="primary"
      page={pagination.page}
      count={pagination.pageCount}
      onChange={(event, value) => api.current.setPage(value)}
    />
  );
}

CustomPagination.propTypes = {
  /**
   * ApiRef that let you manipulate the grid.
   */
  api: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  /**
   * The object containing all pagination details in [[PaginationState]].
   */
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    paginationMode: PropTypes.oneOf(["client", "server"]).isRequired,
    rowCount: PropTypes.number.isRequired,
  }).isRequired,
};

const DialogPacking = ({ orderData, open, onClose }) => {
  const rowHeight = 80;
  const rowsQty = 50;
  const [rows, setRows] = useState([]);
  // const [rowsData, setRowsData] = useState([]);
  // const [filteredRows, setFilteredRows] = useState([]);
  // const [filter, setFilter] = useState("all");

  // const [voiceText, setVoiceText] = useState("");
  // console.log(batchNumber);
  // const stopWord = "стоп";

  const { loading, error, data } = useSubscription(SUBSCRIPTION_ITEMS, {
    variables: {
      order_id: orderData.id,
    },
  });

  useEffect(() => {
    if (!loading && data) {
      console.log(data);

      let preparedData = data.items.map((it) => {
        let qty_registered =
          it.price.qty_to.aggregate.sum.qty - it.price.qty_from.aggregate.sum.qty;
        let qty_packed =
          it.price.qty_from_collected.aggregate.sum.qty -
          it.price.qty_to_collected.aggregate.sum.qty;
        return {
          id: it.id,
          item_id: it.item_id,
          note: it.note,
          qty: it.qty,
          qty_registered: qty_registered,
          qty_packed: qty_packed,
          item_art: it.price.art,
          item_name: it.price.name_voice,
          toBox: qty_registered - qty_packed,
        };
      });
      console.log(preparedData);
      setRows(preparedData);
    }
  }, [loading, data]);

  // items for table
  const columns = useMemo(
    () => [
      { field: "id", headerName: "id", width: 80, hide: true },
      { field: "image", headerName: "img", width: rowHeight + 30, renderCell: Image },
      { field: "item_name", headerName: "Название", width: 250 },
      { field: "qty", headerName: "Заказано", type: "number", width: 110 },
      { field: "qty_registered", headerName: "Принято", type: "number", width: 110 },
      { field: "qty_packed", headerName: "Упаковано", type: "number", width: 110 },
      { field: "toBox", headerName: "К-во упаковать", width: 200, renderCell: toBoxField },
      { field: "packButton", headerName: "Упаковать", width: 150, renderCell: packButton },
    ],
    []
  );

  // id: it.id,
  // item_id: it.item_id,
  // note: it.note,
  // qty: it.qty,
  // qty_registered: qty_registered,
  // qty_packed: qty_packed,
  // item_art: it.price.art,
  // item_name: it.price.name_voice,
  function packButton(params) {
    return <PackToBox params={params} />;
  }

  function toBoxField(params) {
    // console.log(params);
    return (
      <strong>
        <QuantityChanger
          minValue={-params.row.qty_packed}
          maxValue={params.row.qty_registered - params.row.qty_packed}
          id={params.row.id}
          onChange={(newValue) => onCountChange(newValue, rows, params.row.id)}
          value={params.row.toBox}
          colorType="default"
        />
      </strong>
    );
  }

  const onCountChange = (newCount, currentRows, id) => {
    console.log(newCount, currentRows, id);
    const preparedRow = currentRows.map((row) => {
      console.log(row.id, id);
      if (row.id === id) {
        return {
          ...row,
          toBox: newCount,
        };
      }
      return row;
    });
    console.log("onChange", preparedRow);
    setRows(preparedRow);
  };

  function Image(params) {
    const imgSource =
      "https://realan-suvenir.ru/image/cache/catalog/products/" +
      params.row.item_art +
      "-100x100.jpg";
    return <img src={imgSource} alt="Item" width={rowHeight} height={rowHeight} />;
  }

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={true}
      maxWidth={false}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        {orderData.id} {orderData.town} {orderData.customer}
      </DialogTitle>
      <DialogActions>
        <Box flexGrow={1}>
          <BoxNumberButtons />
        </Box>
        <Button onClick={onClose} color="primary" variant="outlined">
          Закрыть
        </Button>
      </DialogActions>
      <DialogContent>
        <div style={{ height: rowHeight * rowsQty + 200, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={rowHeight}
            //onRowClick={onRowClick}
            pagination
            pageSize={rowsQty}
            components={{ pagination: CustomPagination }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPacking;
