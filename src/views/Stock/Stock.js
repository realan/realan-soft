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
import TextField from "@material-ui/core/TextField";
// import { withStyles } from "@material-ui/core/styles";
// import { XGrid } from '@material-ui/x-grid';

const SUBSCRIPTION_STOCK = gql`
  subscription {
    pivot(order_by: { item_id: asc }) {
      id: item_id
      item_name
      item_art
      stock_now
      order_this_week
      collected_this_week
      order_next_week
      collected_next_week
      order_next
    }
  }
`;

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
  textFieldEmpty: {
    background: "pink",
  },
  textFieldExists: {
    background: "PaleGreen",
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

const Stock = () => {
  const classes = useStyles();
  const rowHeight = 50;
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
  const [filter, setFilter] = useState("all");
  const [batchData, setBatchData] = useState({
    number: "",
    isExist: false,
  });
  // const [voiceText, setVoiceText] = useState("");

  const stopWord = "стоп";

  // hook for data from db
  const { loading, error, data } = useSubscription(SUBSCRIPTION_STOCK);

  useEffect(() => {
    if (!loading && data) {
      // let obj = data.pivot.map(it => {
      //   let
      //   return
      // });

      setRowsData(data.pivot);
      setRows(data.pivot);
    }
  }, [loading, data]);

  // items for table
  const columns = useMemo(
    () => [
      { field: "id", headerName: "id", width: 10 },
      { field: "image", headerName: "id", width: rowHeight + 30, renderCell: Image },
      { field: "item_name", headerName: "Название", width: 380 },
      { field: "stock_now", headerName: "Склад", type: "number", width: 80 },
      { field: "order_this_week", headerName: "Зкз 1", type: "number", width: 80 },
      { field: "collected_this_week", headerName: "Нбр 1", type: "number", width: 80 },
      { field: "order_next_week", headerName: "Зкз 2", type: "number", width: 80 },
      { field: "collected_next_week", headerName: "Нбр 2", type: "number", width: 80 },
      { field: "order_next", headerName: "Зкз далее", type: "number", width: 80 },
    ],
    []
  );

  const onRowClick = (row) => {
    // console.log(row);
    // if (row.row.order_next + row.row.order_next_week + row.row.order_this_week > 0) {
    setItemForDialog({
      isOpen: true,
      stockQty: row.row.stock_now,
      itemId: row.row.id,
      itemName: row.row.item_name,
      itemArt: row.row.item_art,
      batchNumber: batchData.number,
    });
    // } else {
    //   console.log(row)
    //   setItemForDialog({ isOpen: true, itemId: row.row.id, stockQty: 0 });
    //   // alert("Этой позиции нет в заказах");
    // }
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
      default:
        preparedRows = rowsData;
        break;
    }
    // console.log("Stock rows", preparedRows);
    setRows(preparedRows);
  };

  const onVoiceChange = (text) => {
    console.log(text);
    if (text !== stopWord) {
      const preparedRows = rowsData.filter((row) => row.item_name.toLowerCase().indexOf(text) >= 0);
      setRows(preparedRows);
      // setVoiceText(text);
    }
  };

  const handleBatchChange = (event) => {
    let flag = event.target.value === "" ? false : true;
    setBatchData({ number: event.target.value, isExist: flag });
  };

  return (
    <div>
      <Box>
        <Box>
          <TextField
            className={batchData.isExist ? classes.textFieldExists : classes.textFieldEmpty}
            label="Номер коробки/лотка"
            variant="outlined"
            id="custom-outlined-input"
            value={batchData.number}
            onChange={handleBatchChange}
          />
        </Box>
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
          note={itemForDialog.batchNumber}
        />
      )}
    </div>
  );
};

export default Stock;
