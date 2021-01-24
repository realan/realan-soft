import React from "react";
import { gql } from "apollo-boost";
import { useState, useMemo } from "react";
import { useSubscription } from "@apollo/react-hooks";
// import DialogOrders from "../components/DialogOrders/DialogOrders.js";
import { DataGrid } from "@material-ui/data-grid";
import Pagination from "@material-ui/lab/Pagination";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import DialogStock from "components/DialogStock/DialogStock.js";
import StockTableChoise from "components/StockTableChoise/StockTableChoise";
// import { XGrid } from '@material-ui/x-grid';

const SUBSCRIPTION_STOCK = gql`
  subscription {
    mr_pivot {
      id: item_id
      item_name
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
  // date for dialog
  const [itemForDialog, setItemForDialog] = useState({
    isOpen: false,
    itemId: undefined,
    stockQty: undefined,
    // whatShow: "all",
  });
  // const [rows, setRows] = useState([]);

  // hook for data from db
  const { loading, error, data } = useSubscription(SUBSCRIPTION_STOCK);

  // useEffect(() => {
  //   if (!loading && data) {
  //     const preparedRows = data.mr_pivot.map((it) => {
  //       let obj = {
  //         id: it.id,
  //         item_name: it.item_name,
  //         stock_now: it.stock_now,
  //         order_this_week: it.order_this_week,
  //         collected_this_week: it.collected_this_week,
  //         order_next_week: it.order_next_week,
  //         collected_next_week: it.order_next_week,
  //         order_next: it.order_next_week,
  //       };
  //       return obj;
  //     });
  //     setRows(preparedRows);
  //   }
  // }, [loading, data, itemForDialog.whatShow]);

  // items for table
  const columns = useMemo(
    () => [
      { field: "id", headerName: "id", width: 10 },
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
    if (row.row.order_next + row.row.order_next_week + row.row.order_this_week > 0) {
      setItemForDialog({ isOpen: true, itemId: row.row.id, stockQty: row.row.stock_now });
    } else {
      alert("Этой позиции нет в заказах");
    }
  };

  const handleClose = () => {
    setItemForDialog({ ...itemForDialog, isOpen: false });
  };


  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <StockTableChoise/>
      <div style={{ height: 1400, width: "100%" }}>
        <DataGrid 
          rows={data.mr_pivot} 
          columns={columns} 
          rowHeight={30} 
          onRowClick={onRowClick} 
          pagination
          pageSize={40}
          components={{ pagination: CustomPagination }}
        />
      </div>

      {itemForDialog.itemId && (
        <DialogStock
          open={itemForDialog.isOpen}
          handleClose={handleClose}
          item_id={itemForDialog.itemId}
          stock_now={itemForDialog.stockQty}
        />
      )}
    </div>
  );
};

export default Stock;
