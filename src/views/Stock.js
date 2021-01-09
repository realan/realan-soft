import React  from "react";
import { gql } from "apollo-boost";
import { useState, useMemo } from 'react';
import { useSubscription } from "@apollo/react-hooks";
// import DialogOrders from "../components/DialogOrders/DialogOrders.js";
import { DataGrid } from '@material-ui/data-grid';
import DialogStock from "components/DialogStock/DialogStock.js";
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

  const columns = useMemo( () =>
  [
    { field: 'id', headerName: 'id', width: 30 },
    { field: 'item_name', headerName: 'Название', width: 200 },
    { field: 'stock_now', headerName: 'Склад', type: "number", width: 110 },
    { field: 'order_this_week', headerName: 'Заказ 1', type: "number", width: 110 },
    { field: 'collected_this_week', headerName: 'Набрано 1', type: "number", width: 110 },
    { field: 'order_next_week', headerName: 'Заказ 2', type: "number", width: 110 },
    { field: 'collected_next_week', headerName: 'Набрано 2', type: "number", width: 110 },
    { field: 'order_next', headerName: 'Заказ далее', type: "number", width: 110 },
  ]
  , []);

    //For modal dialog window
    const [open, setOpen] = useState(false);
    const [itemId, setItemId] = useState();
    const [stockQty, setStockQty] = useState();

    const onRowClick = (row) => {
      if (row.row.order_next + row.row.order_next_week + row.row.order_this_week > 0) {
        setItemId(row.row.id);
        setStockQty(row.row.stock_now);
        setOpen(true);
      } else {
        alert("Этой позиции нет в заказах")
      }

    }
    const handleClose = () => {
      setOpen(false);
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
  const { loading, error, data } = useSubscription(SUBSCRIPTION_STOCK);
  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  // const tableData=data.mr_pivot;

  // console.log(tableData)

  return (
    <div>
      <div style={{ height: 700, width: '100%' }}>
        <DataGrid 
          rows={data.mr_pivot} 
          columns={columns} 
          onRowClick={onRowClick}
        />
      </div>
      {itemId && (
        <DialogStock
          open={open}
          handleClose ={handleClose}
          item_id={itemId}
          stock_now={stockQty}
        />
      )}
    </div>
  )
}

export default Stock;
