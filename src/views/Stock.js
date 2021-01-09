import React from 'react';
import { gql } from 'apollo-boost';
import { useState, useMemo } from 'react';
import { useSubscription } from '@apollo/react-hooks';
// import DialogOrders from "../components/DialogOrders/DialogOrders.js";
import { DataGrid } from '@material-ui/data-grid';
import DialogStock from 'components/DialogStock/DialogStock.js';
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

const Stock = () => {
  // date for dialog
  const [itemForDialog, setItemForDialog] = useState({
    isOpen: false,
    itemId: undefined,
    stockQty: undefined,
  });

  // hook for data from db
  const { loading, error, data } = useSubscription(SUBSCRIPTION_STOCK);

  // items for table
  const columns = useMemo(
    () => [
      // { field: 'id', headerName: 'id', width: 30 },
      { field: 'item_name', headerName: 'Название', width: 200 },
      { field: 'stock_now', headerName: 'Склад', type: 'number', width: 80 },
      { field: 'order_this_week', headerName: 'Зк1', type: 'number', width: 80 },
      { field: 'collected_this_week', headerName: 'Нб1', type: 'number', width: 80 },
      { field: 'order_next_week', headerName: 'Зк22', type: 'number', width: 80 },
      { field: 'collected_next_week', headerName: 'Нб2', type: 'number', width: 80 },
      { field: 'order_next', headerName: 'Зк--', type: 'number', width: 80 },
    ],
    []
  );

  const onRowClick = (row) => {
    if (row.row.order_next + row.row.order_next_week + row.row.order_this_week > 0) {
      setItemForDialog({ isOpen: true, itemId: row.row.id, stockQty: row.row.stock_now });
    } else {
      alert('Этой позиции нет в заказах');
    }
  };

  const handleClose = () => {
    setItemForDialog({ ...itemForDialog, isOpen: false });
  };

  // useEffect(() => {
  //   if(!loading && data){
  //     setDataDB(data.mr_items.map( (ord) => {
  //       return {
  //         qtyFromProd: 0, // initial value
  //         qtyFromStock: 0, // initial value
  //         to_order: ord.mr_order.id,
  //         item: item_id,
  //       }
  //     }));
  //   }
  // }, [loading, data])
  // const tableData=data.mr_pivot;
  // console.log(tableData)

  if (loading) return 'Loading....';
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <div style={{ height: 700, width: '100%' }}>
        <DataGrid rows={data.mr_pivot} columns={columns} onRowClick={onRowClick} />
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
