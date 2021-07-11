import React from "react";
import { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DataGrid } from "@material-ui/data-grid";
import InputWithButtons from "components/InputWithButtons/InputWithButtons";
// import CardPosInOrder from "components/CardPosInOrder/CardPosInOrder";
import Switch from "@material-ui/core/Switch";
import DialogStockCorrectQty from "components/DialogStockCorrectQty/DialogStockCorrectQty";
import ConfirmSnackbar from "components/ConfirmSnackbar/ConfirmSnackbar";
// import { ADD_MOVE_ITEM } from "../../GraphQL/Mutations";
import { ADD_MOVES_ITEMS } from "../../GraphQL/Mutations";
import { QuantityChanger } from "components/QuantityChanger";
import { orderConstant } from "constants/orderConstant";

// export const UPDATE_SUPPLY_ITEM = gql`
//   mutation UpdateSupplyItem($id: Int!, $qty_registered: Int!) {
//     update_items_suppiers_by_pk(
//       pk_columns: { id: $id }
//       _set: { qty_registered: $qty_registered }
//     ) {
//       id
//     }
//   }
// `;

// const useStyles = makeStyles(styles);

const SUBSCRIPTION_ORDERS_BY_ID = gql`
  subscription SubscriptionsOrdersByItemId($item_id: Int!) {
    items(
      where: { item_id: { _eq: $item_id }, order: { is_shipped: { _eq: false } } }
      order_by: { order: { date_out: asc_nulls_last } }
    ) {
      id
      order_id
      qty
      note
      order {
        id
        customer_id
        city
        date_out
        customer {
          name
        }
        movingsToOrder(where: { item_id: { _eq: $item_id } }) {
          qty
        }
        movingsFromOrder(where: { item_id: { _eq: $item_id } }) {
          qty
        }
      }
      price {
        id
        name
      }
    }
  }
`;

const initConfirm = {
  type: "warning",
  message: "Ничего не проведено",
  open: false,
};

const STORE_TYPE = {
  PRODUCTION: "production",
  STOCK: "stock",
};

// const DialogStock = (props) => {
const DialogStock = ({
  open,
  handleClose,
  item_id,
  item_name,
  item_art,
  stock_now,
  note,
  order_supply_id = orderConstant.stockMramolit,
  // item_supply_id,
  // qty_registered,
}) => {
  // console.log("render DialogStock")
  // const classes = useStyles();
  const [itemId, setItemId] = useState(undefined);
  const [stockQty, setStockQty] = useState(0); // now in stock
  const [stockToProd, setStockToProd] = useState(0);
  const [prodToStock, setProdToStock] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const [openCorrectQty, setOpenCorrectQty] = useState(false);
  // const [openConfirm, setOpenConfirm] = useState(false);
  const [confirm, setConfirm] = useState(initConfirm);
  const [rows, setRows] = useState([]);

  // console.log("note", note);

  function fromProdField(params) {
    // console.log("row params. Pay attn rowIndex as id", params);
    const needQty = params.row.needQty - params.row.fromStock;
    return (
      <strong>
        <QuantityChanger
          maxValue={needQty}
          id={params.row.id}
          onChange={(newValue) =>
            onCountChange(newValue, rows, params.row.id, STORE_TYPE.PRODUCTION)
          }
          colorType="default"
          value={params.row.fromProd}
        />
      </strong>
    );
  }

  function fromStockField(params) {
    // console.log(params);
    const needQty = params.row.needQty - params.row.fromProd;
    let maxValue = 0;
    needQty < stockQty ? (maxValue = needQty) : (maxValue = stockQty);
    return (
      <strong>
        <QuantityChanger
          minValue={-(params.row.orderQty - params.row.needQty)}
          maxValue={maxValue}
          id={params.row.id}
          onChange={(newValue) => onCountChange(newValue, rows, params.row.id, STORE_TYPE.STOCK)}
          value={params.row.fromStock}
        />
      </strong>
    );
  }

  const columns = [
    { field: "id", headerName: "id", width: 10 },
    { field: "orderId", headerName: "idOrder", width: 80 },
    // { field: 'customer', headerName: 'Заказчик', width: 150 },
    // { field: 'town', headerName: 'Город', width: 110 },
    { field: "townAndCustomer", headerName: "Заказ", width: 250 },
    { field: "dateOut", headerName: "Дата отгрузки", type: "date", width: 110 },
    // { field: 'collected', headerName: 'Набрано%', type: "number", width: 80 },
    { field: "orderQty", headerName: "Заказ", type: "number", width: 80 },
    // { field: 'needQty', headerName: 'Нужно', type: "number", width: 80 },
    { field: "collectedQty", headerName: "Набрано", type: "number", width: 80 },
    { field: "fromProd", headerName: "От поставщика", width: 200, renderCell: fromProdField },
    { field: "fromStock", headerName: "Со склада", width: 200, renderCell: fromStockField },
    { field: "note", headerName: "Примечание", type: "text", width: 110 },
  ];

  const [AddMoves, { data: dataAddMoves }] = useMutation(ADD_MOVES_ITEMS); // { loading: loadAddMoves, error: errorAddMoves, data: dataAddMoves },
  // const [UpdateSupplyItems] = useMutation(UPDATE_SUPPLY_ITEM);

  const { loading, error, data } = useSubscription(SUBSCRIPTION_ORDERS_BY_ID, {
    variables: { item_id: itemId },
  });

  useEffect(() => {
    // console.log("dataItems", dataItems);
    if (dataAddMoves) {
      setConfirm((prevState) => ({ ...prevState, ["open"]: true }));
    }
  }, [dataAddMoves]);

  useEffect(() => {
    setItemId(item_id);
    setStockQty(stock_now);
  }, [stock_now, item_id]);

  useEffect(() => {
    if (data) {
      // console.log(itemId);
      // console.log("stock item data", data);
      const preparedData = data.items.map((it, key) => {
        const dateOut = new Date(it.order.date_out);
        const sumTo = it.order.movingsToOrder.reduce((sum, current) => sum + current.qty, 0);
        const sumFrom = it.order.movingsFromOrder.reduce((sum, current) => sum + current.qty, 0);
        const needQty = it.qty - (sumTo - sumFrom);
        const collectedQty = sumTo - sumFrom;

        let obj = {
          id: key, // it.id,
          orderId: it.order.id,
          customer: it.order.customer.name,
          town: it.order.city,
          townAndCustomer: it.order.city + " " + it.order.customer.name,
          dateOut: dateOut,
          collectedQty: collectedQty,
          orderQty: it.qty,
          needQty: needQty,
          fromProd: 0, //it.qty,
          fromStock: 0, // it.qty,
          note: it.note,
          // item: itemId,
        };
        return obj;
      });
      // console.log("preparedData", preparedData);
      setRows(preparedData);
    }
  }, [data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;
  // if (loadAddMoves) return "Loading....";
  // if (errorAddMoves) return `Error! ${errorAddMoves.message}`;

  const handleSubmit = () => {
    // console.log("handle OK", rows);
    const addData = [];
    let message = "Добавлено \n";
    let sumFromProd = 0; // количество пришедщего с производства
    rows.map((it) => {
      let obj = {};
      if (it.fromProd !== 0) {
        obj = {
          qty: it.fromProd,
          to_order: it.orderId,
          from_order: order_supply_id, //  типа постоянное значение заказа !!!!!!!!
          item_id: itemId,
          note: note, // номер партии
        };
        message = message + obj.qty + " шт. - " + it.customer + " от поставщика\n";
        addData.push(obj);
        sumFromProd = sumFromProd + obj.qty;
      }
      if (it.fromStock !== 0) {
        obj = {
          qty: it.fromStock,
          to_order: it.orderId,
          from_order: orderConstant.stockRealan,
          item_id: itemId,
        };
        message = message + obj.qty + " шт. - " + it.customer + " со склада\n";
        addData.push(obj);
      }
      return 1; //хз почему return
    });
    let obj = {};
    if (stockToProd > 0) {
      // Брак: фиксируем и возвращаем поставщику
      obj = {
        qty: stockToProd,
        to_order: orderConstant.defectItems,
        from_order: order_supply_id,
        item_id: itemId,
        note: note,
      };
      message = message + obj.qty + " шт. - возврат поставщику\n";
      addData.push(obj);
      obj = {
        qty: stockToProd,
        to_order: order_supply_id,
        from_order: orderConstant.defectItems,
        item_id: itemId,
        note: note,
      };
      addData.push(obj);
    }
    if (prodToStock > 0) {
      // От поставщика на свободный склад
      obj = {
        qty: prodToStock,
        to_order: orderConstant.stockRealan,
        from_order: order_supply_id,
        item_id: itemId,
        note: note, // номер партии
      };
      message = message + obj.qty + " шт. - на склад\n";
      addData.push(obj);
      sumFromProd = sumFromProd + obj.qty;
    }
    // console.log("move items", addData);
    if (addData.length > 0) {
      console.log(addData);
      console.log(message);
      setConfirm({
        type: "success",
        message: message,
        open: false,
      });
      AddMoves({ variables: { addData: addData } });
    } else {
      console.log("confirm", confirm);
      setConfirm((prevState) => ({ ...prevState, ["open"]: true }));
    }

    // if (sumFromProd > 0 && item_supply_id && order_supply_id !== orderConstant.stockMramolit) {
    //   // Жопа, надо подумать
    //   UpdateSupplyItems({
    //     variables: { id: item_supply_id, qty_registered: sumFromProd + qty_registered },
    //   });
    // }
    setProdToStock(0);
    setStockToProd(0);
    handleClose();
  };

  const handleCancel = () => {
    setStockQty(stock_now);
    handleClose();
  };
  const handleChangeStockToProd = (qty) => {
    setStockToProd(qty);
  };
  // const handleChangeDefectToProd = (qty) => {
  //   setStockToProd(qty);
  // };
  const handleChangeProdToStock = (qty) => {
    setProdToStock(qty);
  };

  const handleCorrectQty = (qty) => {
    // console.log(qty);
    setOpenCorrectQty(false);
    if (!isNaN(qty)) {
      setStockQty(qty);
    }
  };
  const handleFilter = () => {
    setShowCards(!showCards);
  };

  const onCountChange = (newCount, currentRows, id, storeType) => {
    // console.log("New count", newCount);
    // console.log("currentRows", currentRows);
    // console.log("id", id);
    // console.log("storeType", storeType);
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

    if (storeType === STORE_TYPE.STOCK) {
      let sumQtyFromStock = preparedRow.reduce(function (sum, elem) {
        return sum + elem.fromStock;
      }, 0);
      setStockQty(stock_now - sumQtyFromStock);
    }
    // console.log(preparedRow);
    setRows(preparedRow);
  };

  const imgSource =
    "https://realan-suvenir.ru/image/cache/catalog/products/" + item_art + "-542x542.jpg";

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={true}
        maxWidth={false}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {item_name}
          <Switch checked={showCards} onChange={handleFilter} name="checkedB" color="primary" />
          Карточки
          <img src={imgSource} alt="Item" width={150} height={150} />
          {"                ПАРТИЯ № (лоток/коробка)  "}
          <strong>{note}</strong>
          <Button
            onClick={() => setOpenCorrectQty(true)}
            color="primary"
            variant="outlined"
            style={{ float: "right" }}
          >
            На складе {stockQty} шт.
          </Button>
        </DialogTitle>

        <DialogContent>
          {Boolean(rows.length) && !showCards && (
            <div style={{ height: rows.length * 55 + 150, width: "100%" }}>
              <DataGrid rows={rows} columns={columns} />
            </div>
          )}

          {/* {Boolean(rows.length) && showCards && (
            <Box display="flex" flexWrap="wrap" m={1}>
              {rows.map((item, key) => {
                return (
                  <Box m={1} bgcolor="text.disabled" key={key}>
                    <CardPosInOrder
                      key={key}
                      value={item}
                      stock={stockQty}
                      valueDB={rows[key]} //{dataDB[item.id].qtyFromStock}
                      // onChange={onQtyChange}
                    />
                  </Box>
                );
              })}
            </Box>
          )} */}

          <div>
            {" "}
            От поставщика на склад
            <InputWithButtons onChange={handleChangeProdToStock} />
          </div>

          <div>
            {" "}
            Брак: проводим приход на склад и возврат поставщику.
            <InputWithButtons onChange={handleChangeStockToProd} />
          </div>
        </DialogContent>

        <DialogActions>
          <Box flexGrow={1}>
            <Button onClick={handleCancel} color="primary" variant="outlined">
              Отмена
            </Button>
          </Box>
          <Button onClick={handleSubmit} color="primary" variant="contained" size="large">
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>

      {openCorrectQty && (
        <DialogStockCorrectQty
          open={openCorrectQty}
          itemId={item_id}
          name={item_name}
          stockNow={stockQty}
          handleClose={handleCorrectQty}
        />
      )}

      {confirm.open && (
        <ConfirmSnackbar
          open={confirm.open}
          message={confirm.message}
          type={confirm.type}
          onClose={() => setConfirm(initConfirm)} //() => setOpenConfirm(false)}
        />
      )}
    </div>
  );
};

export default DialogStock;
