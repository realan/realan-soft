import React from "react";
import { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
// import { XGrid } from '@material-ui/x-grid';
import { DataGrid } from "@material-ui/data-grid";
import Pagination from "@material-ui/lab/Pagination";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";
import { QuantityChanger } from "components/QuantityChanger";
import { TextField } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import { ADD_MOVE_ITEM } from "../../GraphQL/Mutations";
// import UpdateItemInOrder from "components/ModalDialogs/UpdateItemInOrder";

// const useStyles = makeStyles(styles);

const UPDATE_ITEM_IN_ORDER = gql`
  mutation UpdateItemInOrder($id: Int!, $qty: Int!, $note: String) {
    update_mr_items(where: { id: { _eq: $id } }, _set: { qty: $qty, note: $note }) {
      returning {
        id
      }
    }
  }
`;

const DELETE_ITEM_FROM_ORDER = gql`
  mutation DeleteItemFromOrder($id: Int!) {
    delete_mr_items(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;

const UPDATE_ORDER_DATE = gql`
  mutation UpdateOrderDate($id: Int!, $date_out: timestamptz) {
    update_mr_order(where: { id: { _eq: $id } }, _set: { date_out: $date_out }) {
      returning {
        id
      }
    }
  }
`;

const SET_ORDER_CANCELLED = gql`
  mutation UpdateSetOrderCancelled($id: Int!) {
    update_mr_order(where: { id: { _eq: $id } }, _set: { is_cancelled: true }) {
      returning {
        id
      }
    }
  }
`;

const SUBSCRIPTION_ITEMS_IN_ORDER = gql`
  subscription SubscriptionsItemsInOrder($order_id: Int!) {
    mr_items(order_by: { item: asc }, where: { mr_order: { id: { _eq: $order_id } } }) {
      id
      item
      qty
      note
  		stock_data{
        stock_now
      }
      mr_price {
        id
        name
        qty_to: mr_movings_aggregate(where: { to_order: { _eq: $order_id } }) {
          aggregate {
            sum {
              qty
            }
          }
        }
        qty_from: mr_movings_aggregate(where: { from_order: { _eq: $order_id } }) {
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

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

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

const DialogOrders = (props) => {
  // const classes = useStyles();

  let orderId = props.orderData.id;

  const [rows, setRows] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openAddItem, setOpenAddItem] = useState(false);
  const [dataRow, setDataRow] = useState({});
  const [orderDate, setOrderDate] = useState();

  const [UpdateMutation] = useMutation(UPDATE_ITEM_IN_ORDER);
  const [UpdateDateMutation] = useMutation(UPDATE_ORDER_DATE);
  const [DeteteItemMutation] = useMutation(DELETE_ITEM_FROM_ORDER);
  const [AddMoveItemMutation] = useMutation(ADD_MOVE_ITEM);
  const [SetOrderCancelledMutation] = useMutation(SET_ORDER_CANCELLED);

  const posUpdate = (params) => {
    setDataRow(params.row);
    setOpenUpdate(true);
  };

  const onePosDelete = (data) => {
    DeteteItemMutation({ variables: { id: data.id } });
    let qty = data.qtyCollect;
    if (qty !== 0) {
      const addData = {
        qty: qty,
        to_order: 3, // id = 3 - склад
        from_order: orderId,
        item: data.qtyCollect,
      };
      AddMoveItemMutation({ variables: { addData: addData } });
    }
  };

  const posDelete = (params) => {
    onePosDelete(params.row);
  };

  function updateField(params) {
    return (
      <strong>
        <IconButton
          color="primary"
          aria-label="редактировать"
          component="span"
          onClick={() => posUpdate(params)}
        >
          <EditIcon />
        </IconButton>
        {/* <UpdateItemInOrder 
          isOpen={openUpdate} 
          count={params.row.qtyOrder}
          text={params.row.note}
          name={params.row.name}
          handleClose={ () => setOpenUpdate(false) }
          handleOk={handleUpdateItem}
          handleChange
        /> */}
        <Tooltip title="Удаляю позицию. Что набрано - перемещаю на склад">
          <IconButton
            color="secondary"
            aria-label="редактировать"
            component="span"
            onClick={() => posDelete(params)}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </strong>
    );
  }

  function fromProdField(params) {
    const needQty = params.row.qtyOrder - params.row.qtyCollect- params.row.fromStock;
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
    (needQty < params.row.qtyStock) ? maxValue = needQty : maxValue = params.row.qtyStock;
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
    { field: "update", headerName: "обновить", width: 100, renderCell: updateField },
  ];

  useEffect(() => {
    setOrderDate(props.orderData.date_out);
  }, [props.orderData.date_out]);

  const { loading, error, data } = useSubscription(SUBSCRIPTION_ITEMS_IN_ORDER, {
    variables: { order_id: orderId },
  });

  useEffect(() => {
    if (!loading && data) {
      // console.log(data);
      const preparedRows = data.mr_items.map((it, key) => {
        const qtyCollect =
          it.mr_price.qty_to.aggregate.sum.qty - it.mr_price.qty_from.aggregate.sum.qty;

        return {
          id: key, // it.id,
          name: it.mr_price.name,
          qtyOrder: it.qty,
          // needQty: needQty,
          qtyStock: it.stock_data.stock_now,
          qtyCollect: qtyCollect,
          fromProd: 0, //it.qty,
          fromStock: 0, // it.qty,
          note: it.note,
          to_order: props.orderData.id,
          idItem: it.mr_price.id,
        };
      });

      setRows(preparedRows);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleOK = () => {
    props.handleClose();
  };

  const handleCancel = () => {
    props.handleClose();
  };
  const handleUpdateClose = () => {
    setOpenUpdate(false);
  };
  const handleUpdateItem = () => {
    const dataNew = {
      id: dataRow.id,
      qty: dataRow.qtyOrder,
      note: dataRow.note,
    };
    UpdateMutation({ variables: dataNew });
    setOpenUpdate(false);
  };
  const handleQtyChange = (event) => {
    setDataRow({ ...dataRow, qtyOrder: event.target.value });
  };
  const handleNoteChange = (event) => {
    setDataRow({ ...dataRow, note: event.target.value });
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
  const handleDeleteOrder = () => {
    // deleting items in order and move items from order to stock
    rows.map((item) => {
      onePosDelete(item);
      return true;
    });
    props.handleClose();
    SetOrderCancelledMutation({ variables: { id: orderId } });
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
    currentRows.map((it) => {
      if (it.qtyFromProd !== 0) {
        let addData = {
          qty: it.fromProd,
          to_order: it.to_order,
          from_order: 2, // у доработки ID = 2 - типа постоянное значение заказа !!!!!!!!
          item: it.idItem,
        };
        AddMoveItemMutation({ variables: { addData: addData } });
      }
      if (it.qtyFromStock !== 0) {
        let addData = {
          qty: it.fromStock,
          to_order: it.to_order,
          from_order: 3, // у склада ID = 3 - типа постоянное значение заказа !!!!!!!!
          item: it.idItem,
        };
        AddMoveItemMutation({ variables: { addData: addData } });
      }
      return true;
    });

    props.handleClose();
  };

  const handleAddItem = () => {  }
  const handleAddItemClose = () => { setOpenAddItem(false) }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        fullWidth={true}
        fullScreen={true}
        maxWidth="md"
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {props.orderData.customer} {props.orderData.town}, отгрузка
          <DatePicker
            selected={orderDate}
            // name={item.accessor}
            showWeekNumbers
            showMonthDropdown
            // placeholderText={item.Header}
            locale={ru}
            // value={orderDate}
            onChange={(date) => {
              handleDateChange(date);
            }}
            // dateFormat="dd-MM-yyyy"
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
          <DialogContentText></DialogContentText>
        </DialogContent>

        <DialogActions>
          <Box flexGrow={1}>
            <Tooltip title="Удаляю заказ. Что набрано - перемещаю на склад">
              <Button onClick={handleDeleteOrder} color="secondary" variant="contained">
                Отменить заказ
              </Button>
            </Tooltip>
          </Box>
          <Box flexGrow={1}>
            <Button onClick={handleAddItem} color="primary" variant="outlined">
              Добавить позицию
            </Button>
          </Box>

          <Box flexGrow={1}>
            <Button onClick={() => makeMoves(rows)} color="primary" variant="contained" size="large">
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

      <Dialog
        open={openUpdate}
        onClose={handleUpdateClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
      >
        <DialogTitle id="form-dialog-title">{dataRow.name} </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Кол-во"
            type="number"
            fullWidth
            value={dataRow.qtyOrder}
            onChange={handleQtyChange}
          />
          <TextField
            margin="dense"
            label="Примечание"
            type="text"
            fullWidth
            value={dataRow.note || ""}
            onChange={handleNoteChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleUpdateItem} color="primary">
            Изменить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAddItem}
        onClose={handleAddItemClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
      >
        <DialogTitle id="form-dialog-title">{dataRow.name} </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Кол-во"
              type="number"
              fullWidth
              value={dataRow.qtyOrder}
              onChange={handleQtyChange}
            />
            <TextField
              margin="dense"
              label="Примечание"
              type="text"
              fullWidth
              value={dataRow.note || ""}
              onChange={handleNoteChange}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleUpdateItem} color="primary">
            Изменить
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default DialogOrders;
