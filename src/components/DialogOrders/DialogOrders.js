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
import Close from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";

import { TextField } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import { ADD_MOVE_ITEM } from "../../GraphQL/Mutations";

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

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const DialogOrders = (props) => {
  // const classes = useStyles();
  let orderId = props.orderData.id;

  const [rows, setRows] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(false);
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

  const columns = [
    { field: "id", headerName: "id", width: 30 },
    { field: "name", headerName: "Наименование", type: "text", width: 200 },
    { field: "qtyOrder", headerName: "Заказ", type: "number", width: 100 },
    { field: "qtyCollect", headerName: "Набрано", type: "number", width: 100 },
    { field: "note", headerName: "Примечание", type: "text", width: 200 },
    {
      field: "update",
      headerName: "обновить",
      width: 100,
      renderCell: (params) => (
        <strong>
          <IconButton
            color="primary"
            aria-label="редактировать"
            component="span"
            onClick={() => posUpdate(params)}
          >
            <EditIcon />
          </IconButton>
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
      ),
    },
  ];

  useEffect(() => {
    setOrderDate(props.orderData.date_out);
  }, [props.orderData.date_out]);

  const { loading, error, data } = useSubscription(SUBSCRIPTION_ITEMS_IN_ORDER, {
    variables: { order_id: orderId },
  });

  useEffect(() => {
    if (!loading && data) {
      setRows(
        data.mr_items.map((it) => {
          let qtyCollect =
            it.mr_price.qty_to.aggregate.sum.qty - it.mr_price.qty_from.aggregate.sum.qty;
          return {
            id: it.id,
            name: it.mr_price.name,
            qtyOrder: it.qty,
            qtyCollect: qtyCollect,
            note: it.note,
            idItem: it.mr_price.id,
          };
        })
      );
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

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        fullWidth={true}
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
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid columns={columns} rows={rows} rowHeight={32} />
          </div>
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
            <Button onClick={handleCancel} color="primary" variant="outlined">
              Добавить позицию
            </Button>
          </Box>
          <Box>
            <Button onClick={handleOK} color="primary" variant="contained">
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
          <DialogContentText></DialogContentText>
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
