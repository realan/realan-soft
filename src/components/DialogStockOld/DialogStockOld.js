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
import { ADD_MOVE_ITEM } from "../../GraphQL/Mutations";
import { QuantityChanger } from "components/QuantityChanger";

// const useStyles = makeStyles(styles);

const SUBSCRIPTION_ORDERS_BY_ID = gql`
  subscription SubscriptionsOrdersByItemId($item_id: Int!) {
    mr_items(
      where: { item: { _eq: $item_id }, mr_order: { is_shipped: { _eq: false } } }
      order_by: { mr_order: { date_out: asc_nulls_last } }
    ) {
      id
      order
      qty
      note
      mr_order {
        id
        customer
        town
        date_out
        mr_customer {
          name
        }
        mr_to(where: { item: { _eq: $item_id } }) {
          qty
        }
        mr_from(where: { item: { _eq: $item_id } }) {
          qty
        }
      }
      mr_price {
        id
        name
      }
    }
  }
`;

const STORE_TYPE = {
  PRODUCTION: "production",
  STOCK: "stock",
};

// const DialogStock = (props) => {
const DialogStockOld = ({ open, handleClose, item_id, item_name, item_art, stock_now }) => {
  // console.log("render DialogStock")
  // const classes = useStyles();
  const [itemId, setItemId] = useState(undefined);
  const [stockQty, setStockQty] = useState(0); // now in stock
  const [stockToProd, setStockToProd] = useState(0);
  const [prodToStock, setProdToStock] = useState(0);
  const [showCards, setShowCards] = useState(false);
  const [openCorrectQty, setOpenCorrectQty] = useState(false);
  const [rows, setRows] = useState([]);

  function fromProdField(params) {
    // console.log(params);
    const needQty = params.row.needQty - params.row.fromStock;
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
    // console.log(params);
    const needQty = params.row.needQty - params.row.fromProd;
    let maxValue = 0;
    needQty < stockQty ? (maxValue = needQty) : (maxValue = stockQty);
    return (
      <strong>
        <QuantityChanger
          minValue={-(params.row.orderQty - params.row.needQty)}
          maxValue={maxValue}
          id={params.rowIndex}
          onChange={(newValue) => onCountChange(newValue, rows, params.rowIndex, STORE_TYPE.STOCK)}
          value={params.row.fromStock}
        />
      </strong>
    );
  }

  const columns = [
    { field: "id", headerName: "id", width: 10 },
    // { field: 'customer', headerName: 'Заказчик', width: 150 },
    // { field: 'town', headerName: 'Город', width: 110 },
    { field: "townAndCustomer", headerName: "Заказ", width: 250 },
    { field: "dateOut", headerName: "Дата отгрузки", width: 110 },
    // { field: 'collected', headerName: 'Набрано%', type: "number", width: 80 },
    { field: "orderQty", headerName: "Заказ", type: "number", width: 80 },
    // { field: 'needQty', headerName: 'Нужно', type: "number", width: 80 },
    { field: "collectedQty", headerName: "Набрано", type: "number", width: 80 },
    { field: "fromProd", headerName: "С доработки", width: 200, renderCell: fromProdField },
    { field: "fromStock", headerName: "Со склада", width: 200, renderCell: fromStockField },
    { field: "note", headerName: "Примечание", type: "text", width: 110 },
  ];

  const [AddMove] = useMutation(ADD_MOVE_ITEM);

  const { loading, error, data } = useSubscription(SUBSCRIPTION_ORDERS_BY_ID, {
    variables: { item_id: itemId },
  });

  useEffect(() => {
    setItemId(item_id);
    setStockQty(stock_now);
  }, [stock_now, item_id]);

  useEffect(() => {
    if (data) {
      console.log(data);
      const preparedData = data.mr_items.map((it, key) => {
        const dateOut = new Date(it.mr_order.date_out);
        const sumTo = it.mr_order.mr_to.reduce((sum, current) => sum + current.qty, 0);
        const sumFrom = it.mr_order.mr_from.reduce((sum, current) => sum + current.qty, 0);
        const needQty = it.qty - (sumTo - sumFrom);
        const collectedQty = sumTo - sumFrom;

        let obj = {
          id: key, // it.id,
          orderId: it.mr_order.id,
          customer: it.mr_order.mr_customer.name,
          town: it.mr_order.town,
          townAndCustomer: it.mr_order.town + " " + it.mr_order.mr_customer.name,
          dateOut: dateOut.toDateString(),
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
      console.log(preparedData);
      setRows(preparedData);
    }
  }, [data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleOK = () => {
    console.log(rows);
    console.log("handle OK");
    rows.map((it) => {
      if (it.fromProd !== 0) {
        console.log(it);
        let addData = {
          qty: it.fromProd,
          to_order: it.orderId,
          from_order: 2, // у доработки ID = 2 - типа постоянное значение заказа !!!!!!!!
          item: itemId,
        };
        AddMove({ variables: { addData: addData } });
      }
      if (it.fromStock !== 0) {
        console.log(it);
        let addData = {
          qty: it.fromStock,
          to_order: it.orderId,
          from_order: 3, // у склада ID = 3 - типа постоянное значение заказа !!!!!!!!
          item: itemId,
        };
        AddMove({ variables: { addData: addData } });
      }
      return 1; //хз почему return
    });
    if (stockToProd > 0) {
      let addData = {
        qty: stockToProd,
        to_order: 2, // у доработки ID = 2 - типа постоянное значение заказа !!!!!!!!
        from_order: 3, // у склада ID = 3 - типа постоянное значение заказа !!!!!!!!
        item: itemId,
      };
      console.log(addData);
      AddMove({ variables: { addData: addData } });
    }
    if (prodToStock > 0) {
      let addData = {
        qty: prodToStock,
        to_order: 3, // у доработки ID = 2 - типа постоянное значение заказа !!!!!!!!
        from_order: 2, // у склада ID = 3 - типа постоянное значение заказа !!!!!!!!
        item: itemId,
      };
      console.log(addData);
      AddMove({ variables: { addData: addData } });
    }
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
          <img src={imgSource} alt="Item" width={100} height={100} />
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
            <div style={{ height: 800, width: "100%" }}>
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
            Со склада в доработку
            <InputWithButtons onChange={handleChangeStockToProd} />
          </div>

          <div>
            {" "}
            С доработки на склад
            <InputWithButtons onChange={handleChangeProdToStock} />
          </div>
          <div>
            <img src={imgSource} alt="Item" width={100} height={100} />
          </div>
        </DialogContent>

        <DialogActions>
          <Box flexGrow={1}>
            <Button onClick={handleCancel} color="primary" variant="outlined">
              Отмена
            </Button>
          </Box>
          <Button onClick={handleOK} color="primary" variant="contained" size="large">
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>

      <DialogStockCorrectQty
        open={openCorrectQty}
        itemId={item_id}
        name={item_name}
        stockNow={stockQty}
        handleClose={handleCorrectQty}
      />
    </div>
  );
};

export default DialogStockOld;
