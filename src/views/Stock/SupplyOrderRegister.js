import React from "react";
import { gql } from "apollo-boost";
import { useState, useMemo, useEffect } from "react";
import { useSubscription } from "@apollo/react-hooks";
import { DataGrid } from "@material-ui/data-grid";
import Pagination from "@material-ui/lab/Pagination";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import DialogStock from "components/DialogStock/DialogStock.js";
import StockTableChoise from "components/StockTableChoise/StockTableChoise";
import VoiceInput from "components/VoiceInput/VoiceInput";
import { Box } from "@material-ui/core";
import FileExportToXls from "components/FileExportToXls/FileExportToXls";
// import TextField from "@material-ui/core/TextField";
// import { withStyles } from "@material-ui/core/styles";
// import { XGrid } from '@material-ui/x-grid';

const SUBSCRIPTION_ITEMS = gql`
  subscription($order_id: Int!) {
    items_suppiers(where: { order_id: { _eq: $order_id } }, order_by: { price: { id: asc } }) {
      id
      is_registered
      item_id
      note
      qty
      qty_registered
      price {
        art
        name_voice
        pivot {
          stock_now
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

const SupplyOrderRegister = ({ orderId, batchNumber }) => {
  const rowHeight = 80;
  const rowsQty = 50;
  // date for dialog
  const [itemForDialog, setItemForDialog] = useState({
    isOpen: false,
    itemId: undefined,
    stockQty: undefined,
    // whatShow: "all",
  });
  const [rows, setRows] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filter, setFilter] = useState("all");

  // const [voiceText, setVoiceText] = useState("");
  console.log(batchNumber);
  const stopWord = "стоп";

  const { loading, error, data } = useSubscription(SUBSCRIPTION_ITEMS, {
    variables: {
      order_id: orderId,
    },
  });

  useEffect(() => {
    if (!loading && data) {
      // console.log(data);
      let preparedData = data.items_suppiers.map((it) => {
        return {
          id: it.id,
          is_registered: it.is_registered,
          item_id: it.item_id,
          note: it.note,
          qty: it.qty,
          qty_registered: it.qty_registered,
          qty_rest: it.qty - it.qty_registered,
          item_art: it.price.art,
          item_name: it.price.name_voice,
          stock_now: it.price.pivot.stock_now,
        };
      });
      // console.log(preparedData);
      setRowsData(preparedData);
      setFilteredRows(preparedData);
      setRows(preparedData);
    }
  }, [loading, data]);

  // items for table
  const columns = useMemo(
    () => [
      { field: "id", headerName: "item_id", width: 80 },
      { field: "image", headerName: "img", width: rowHeight + 30, renderCell: Image },
      { field: "item_name", headerName: "Название", width: 380 },
      { field: "qty", headerName: "Заказано", type: "number", width: 110 },
      { field: "qty_registered", headerName: "Принято", type: "number", width: 110 },
      { field: "stock_now", headerName: "Склад", type: "number", width: 110 },
    ],
    []
  );

  const onRowClick = (row) => {
    // console.log(row);
    setItemForDialog({
      isOpen: true,
      stockQty: row.row.stock_now,
      itemId: row.row.item_id,
      itemName: row.row.item_name,
      itemArt: row.row.item_art,
      item_supply_id: row.row.id,
      qty_registered: row.row.qty_registered,
      batchNumber: batchNumber,
    });
  };

  function Image(params) {
    const imgSource =
      "https://realan-suvenir.ru/image/cache/catalog/products/" +
      params.row.item_art +
      "-100x100.jpg";
    return <img src={imgSource} alt="Item" width={rowHeight} height={rowHeight} />;
  }

  const handleClose = () => {
    setItemForDialog({ ...itemForDialog, isOpen: false });
  };

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const filterChange = (event) => {
    const filterType = event.target.value;
    let preparedRows = [];
    setFilter(filterType);
    switch (filterType) {
      case "needAllWeeks":
        preparedRows = rowsData.filter(
          (row) => row.order_this_week !== 0 || row.order_next_week !== 0 || row.order_next !== 0
        );
        break;
      case "stockNow":
        preparedRows = rowsData.filter((row) => row.stock_now !== 0);
        break;
      case "needThisWeek":
        preparedRows = rowsData.filter(
          (row) => row.order_this_week - row.collected_this_week !== 0
        );
        break;
      case "notRegistered":
        preparedRows = rowsData.filter((row) => row.qty_rest !== 0);
        break;
      default:
        preparedRows = rowsData;
        break;
    }
    // console.log("Stock rows", preparedRows);
    setFilteredRows(preparedRows);
    setRows(preparedRows);
  };

  const onVoiceChange = (text) => {
    // console.log(text);
    if (text !== stopWord) {
      const preparedRows = filteredRows.filter(
        (row) => row.item_name.toLowerCase().indexOf(text) >= 0
      );
      setRows(preparedRows);
      // setVoiceText(text);
    }
  };

  return (
    <div>
      <Box>
        <Box flexGrow={1}>
          <StockTableChoise value={filter} onChange={filterChange} />
        </Box>
        <Box>
          <VoiceInput onChange={onVoiceChange} stopWord={stopWord} />
        </Box>
      </Box>
      <div style={{ height: rowHeight * rowsQty + 200, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          onRowClick={onRowClick}
          pagination
          pageSize={rowsQty}
          components={{ pagination: CustomPagination }}
        />
      </div>
      <FileExportToXls data={rows} name={"склад"} />
      {itemForDialog.itemId && (
        <DialogStock
          open={itemForDialog.isOpen}
          handleClose={handleClose}
          item_id={itemForDialog.itemId}
          item_name={itemForDialog.itemName}
          item_art={itemForDialog.itemArt}
          stock_now={itemForDialog.stockQty}
          order_supply_id={orderId}
          item_supply_id={itemForDialog.item_supply_id}
          qty_registered={itemForDialog.qty_registered}
          note={batchNumber}
        />
      )}
    </div>
  );
};

export default SupplyOrderRegister;
