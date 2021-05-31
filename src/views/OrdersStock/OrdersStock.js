import React from "react";
import { useState, useMemo, useEffect } from "react";
// import { XGrid } from '@material-ui/x-grid';
import { DataGrid } from "@material-ui/data-grid";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import { renderProgress } from "@material-ui/x-grid-data-generator";
import DialogOrders from "components/DialogOrders/DialogOrders.js";
// import AddIcon from '@material-ui/icons/Add';

const SUBSCRIPTION_ORDERS_STOCK = gql`
  subscription {
    orders(where: { is_cancelled: { _eq: false }, is_shipped: { _eq: false } }) {
      id
      customer_id
      city
      date_in
      date_out
      customer {
        id
        name
      }
      items_aggregate {
        aggregate {
          sum {
            qty
          }
        }
      }
      movingsToOrder_aggregate {
        aggregate {
          sum {
            qty
          }
        }
      }
      movingsFromOrder_aggregate {
        aggregate {
          sum {
            qty
          }
        }
      }
    }
  }
`;

const OrdersStock = () => {
  const [itemForDialog, setItemForDialog] = useState({
    isOpen: false,
    orderData: undefined,
  });

  const [rows, setRows] = useState([]);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "id", width: 30 },
      { field: "customer", headerName: "Заказчик", type: "text", width: 200 },
      { field: "town", headerName: "Город", type: "text", width: 120 },
      { field: "date_in", headerName: "Заказан", type: "date", width: 110 },
      { field: "date_out", headerName: "Отгрузка", type: "date", width: 110 },
      { field: "qty", headerName: "Заказ,шт.", type: "number", width: 100 },
      { field: "qtyRatio", headerName: "Набрано", renderCell: renderProgress, width: 100 },
      { field: "status", headerName: "Статус", width: 50 },
    ],
    []
  );

  const { loading, error, data } = useSubscription(SUBSCRIPTION_ORDERS_STOCK);

  useEffect(() => {
    if (!loading && data) {
      const preparedRows = data.orders.map((it) => {
        const dateIn = new Date(it.date_in);
        const dateOut = new Date(it.date_out);
        let qty = it.items_aggregate.aggregate.sum.qty;
        let qtyRatio = +(
          (it.movingsToOrder_aggregate.aggregate.sum.qty -
            it.movingsFromOrder_aggregate.aggregate.sum.qty) /
          qty
        ).toFixed(3);
        let obj = {
          id: it.id,
          customer: it.customer.name,
          town: it.city,
          date_in: dateIn,
          date_out: dateOut,
          qty: qty,
          qtyRatio: qtyRatio,
        };
        return obj;
      });
      console.log("Orders data new", data);
      setRows(preparedRows);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const onRowClick = (row) => {
    console.log("Open Order-Items Dialog. Data", row);
    setItemForDialog({
      orderData: row.row,
      isOpen: true,
    });
  };

  const handleClose = () => {
    setItemForDialog({ ...itemForDialog, isOpen: false });
  };
  // const handleAddOrderClose = () => {
  //   setOpenAddOrder(false);
  // };

  return (
    <>
      {/* <Button color="primary" variant="outlined" onClick={() => setOpenAddOrder(true)}>
        Добавить заказ
      </Button> */}
      <div style={{ height: 1400, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={rows}
          rowHeight={32}
          onRowClick={onRowClick}
          paginaton={true}
        />
      </div>

      {Boolean(itemForDialog.orderData) && (
        <DialogOrders
          open={itemForDialog.isOpen}
          handleClose={handleClose}
          orderData={itemForDialog.orderData}
        />
      )}

      {/* <DialogAddOrder open={openAddOrder} handleClose={handleAddOrderClose} /> */}
    </>
  );
};

export default OrdersStock;
