import React from "react";
import { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
// import { XGrid } from '@material-ui/x-grid';
import { DataGrid } from "@material-ui/data-grid";
import Pagination from "@material-ui/lab/Pagination";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import "react-datepicker/dist/react-datepicker.css";
import { QuantityChanger } from "components/QuantityChanger";
import Box from "@material-ui/core/Box";
// import { ADD_MOVE_ITEM } from "../../GraphQL/Mutations";
import { ADD_MOVES_ITEMS } from "../../GraphQL/Mutations";
import DateButton from "components/DateButton/DateButton";
import AddItemInOrder from "components/AddItemInOrder/AddItemInOrder";
import ButtonDeleteOrder from "components/ButtonDeleteOrder/ButtonDeleteOrder";
import UpdateItemInOrder from "components/UpdateItemInOrder/UpdateItemInOrder";
import DeleteItemFromOrder from "components/DeleteItemFromOrder/DeleteItemFromOrder";
// import DialogAddOrderData from "components/DialogAddOrderData/DialogAddOrderData";

// const useStyles = makeStyles(styles);

const UPDATE_ORDER_DATE = gql`
  mutation UpdateOrderDate($id: Int!, $date_out: timestamptz) {
    update_orders(where: { id: { _eq: $id } }, _set: { date_out: $date_out }) {
      returning {
        id
      }
    }
  }
`;

const SUBSCRIPTION_ITEMS_IN_ORDER = gql`
  subscription SubscriptionsItemsInOrder($order_id: Int!) {
    items(order_by: { price: { name: asc } }, where: { order_id: { _eq: $order_id } }) {
      id
      item_id
      qty
      note
      stock_data {
        into_stock
        out_stock
      }
      price {
        id
        name
        qty_to: movings_aggregate(where: { to_order: { _eq: 30 } }) {
          aggregate {
            sum {
              qty
            }
          }
        }
        qty_from: movings_aggregate(where: { from_order: { _eq: 30 } }) {
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

const STORE_TYPE = {
  PRODUCTION: "production",
  STOCK: "stock",
};

function CustomPagination(props) {
  const { pagination, api } = props;
  const classes = useStyles();

  return (
    <Pagination
      className={classes.root}
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

function updateField(params) {
  const data = params.row;
  return <UpdateItemInOrder value={data} />;
}
function deleteField(params) {
  return <DeleteItemFromOrder value={params.row} />;
}

const DialogOrders = ({ open, handleClose, orderData }) => {
  // const classes = useStyles();
  // console.log("Order Data Dialog", orderData);
  let orderId = orderData.id;

  const [rows, setRows] = useState([]);
  const [orderDate, setOrderDate] = useState();

  const [UpdateDateMutation] = useMutation(UPDATE_ORDER_DATE);
  const [AddMovesItemsMutation] = useMutation(ADD_MOVES_ITEMS);

  function fromProdField(params) {
    const needQty = params.row.qtyOrder - params.row.qtyCollect - params.row.fromStock;
    return (
      <strong>
        <QuantityChanger
          maxValue={needQty}
          id={params.rowIndex}
          onChange={(newValue) =>
            onCountChange(newValue, rows, params.rowIndex, STORE_TYPE.PRODUCTION)
          }
          colorType="default"
          value={params.row.fromProd}
        />
      </strong>
    );
  }

  function fromStockField(params) {
    const needQty = params.row.qtyOrder - params.row.qtyCollect - params.row.fromProd;
    let maxValue = 0;
    needQty < params.row.qtyStock ? (maxValue = needQty) : (maxValue = params.row.qtyStock);
    return (
      <strong>
        <QuantityChanger
          minValue={-params.row.qtyCollect}
          maxValue={maxValue}
          id={params.rowIndex}
          onChange={(newValue) => onCountChange(newValue, rows, params.rowIndex, STORE_TYPE.STOCK)}
          value={params.row.fromStock}
        />
      </strong>
    );
  }

  const columns = [
    { field: "id", headerName: "id", width: 30 },
    { field: "name", headerName: "Наименование", type: "text", width: 280 },
    { field: "qtyOrder", headerName: "Заказ", type: "number", width: 70 },
    { field: "qtyCollect", headerName: "Набрано", type: "number", width: 70 },
    { field: "fromProd", headerName: "С доработки", width: 220, renderCell: fromProdField },
    { field: "qtyStock", headerName: "Склад", type: "number", width: 70 },
    { field: "fromStock", headerName: "Со склада", width: 220, renderCell: fromStockField },
    { field: "note", headerName: "Примечание", type: "text", width: 200 },
    { field: "update", headerName: "Обновить", width: 80, renderCell: updateField },
    { field: "delete", headerName: "Удалить", width: 80, renderCell: deleteField },
  ];

  useEffect(() => {
    setOrderDate(orderData.date_out);
  }, [orderData.date_out]);

  const { loading, error, data } = useSubscription(SUBSCRIPTION_ITEMS_IN_ORDER, {
    variables: { order_id: orderId },
  });

  useEffect(() => {
    if (!loading && data) {
      // console.log("Items in order", data);
      const preparedRows = data.items.map((it, key) => {
        const qtyCollect = it.price.qty_to.aggregate.sum.qty - it.price.qty_from.aggregate.sum.qty;

        return {
          id: key, //it.id,
          idItem: it.price.id,
          name: it.price.name,
          qtyOrder: it.qty,
          qtyStock: it.stock_data.into_stock - it.stock_data.out_stock,
          qtyCollect: qtyCollect,
          fromProd: 0, //it.qty,
          fromStock: 0, // it.qty,
          note: it.note,
          to_order: orderData.id,
          idDb: it.id,
        };
      });

      setRows(preparedRows);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleOK = () => {
    handleClose();
  };

  const handleDateChange = (date) => {
    setOrderDate(date);
    UpdateDateMutation({
      variables: {
        id: orderId,
        date_out: date,
      },
    });
  };

  const onCountChange = (newCount, currentRows, id, storeType) => {
    const preparedRow = currentRows.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          fromProd: storeType === STORE_TYPE.PRODUCTION ? newCount : row.fromProd,
          fromStock: storeType === STORE_TYPE.STOCK ? newCount : row.fromStock,
        };
      }
      return row;
    });
    setRows(preparedRow);
  };

  const makeMoves = (currentRows) => {
    // TODO: replace map to forEach
    const addData = [];
    currentRows.map((it) => {
      let obj = {};
      if (it.fromProd !== 0) {
        obj = {
          qty: it.fromProd,
          to_order: it.to_order,
          from_order: 2, // у доработки ID = 2 - типа постоянное значение заказа !!!!!!!!
          item_id: it.idItem,
        };
        addData.push(obj);
      }
      if (it.fromStock !== 0) {
        obj = {
          qty: it.fromStock,
          to_order: it.to_order,
          from_order: 3, // у склада ID = 3 - типа постоянное значение заказа !!!!!!!!
          item_id: it.idItem,
        };
        addData.push(obj);
      }

      return true;
    });
    console.log("move items", addData);
    if (addData.length > 0) {
      AddMovesItemsMutation({ variables: { addData: addData } });
    }
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        fullScreen={true}
        maxWidth="md"
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {orderData.customer} {orderData.town}, отгрузка
          <DateButton
            value={orderDate}
            onChange={(date) => {
              handleDateChange(date);
            }}
          />
        </DialogTitle>

        <DialogContent>
          {Boolean(rows.length) && (
            <div style={{ height: 800, width: "100%" }}>
              <DataGrid
                autoHeight={true}
                density="compact"
                pagination
                pageSize={40}
                components={{ pagination: CustomPagination }}
                columns={columns}
                rows={rows}
              />
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Box flexGrow={1}>
            <ButtonDeleteOrder items={rows} orderId={orderId} onClick={handleClose} />
          </Box>
          <Box flexGrow={1}>
            <AddItemInOrder orderId={orderData.id} />
          </Box>

          <Box flexGrow={1}>
            <Button
              onClick={() => makeMoves(rows)}
              color="primary"
              variant="contained"
              size="large"
            >
              Обновить кол-во
            </Button>
          </Box>

          <Box>
            <Button onClick={handleOK} color="primary" variant="outlined">
              Закрыть
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogOrders;
