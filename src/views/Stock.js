import React  from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import ReactTableExp from "../components/ReactTableExp/ReactTableExp";
import DialogOrders from "../components/DialogOrders/DialogOrders.js";
import { DataGrid } from '@material-ui/data-grid';
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

  // const columns = React.useMemo(
  //   () => [
  //     {Header: "id", accessor: "item_id", type: "integer", show: false, required: true},
  //     {Header: "Название", accessor: "item_name", type: "text", show: true, required: true},
  //     {Header: "На складе", accessor: "stock_now", type: "integer", show: true, required: true},
  //     {Header: "Эта неделя", columns: [  
  //       {Header: "Заказано", accessor: "order_this_week", type: "integer", show: true, required: true},
  //       {Header: "Набрано", accessor: "collected_this_week", type: "integer", show: true, required: true},
  //     ]}, 
  //     {Header: "Следующая неделя", columns: [  
  //       {Header: "Заказано", accessor: "order_next_week", type: "integer", show: true, required: true},
  //       {Header: "Набрано", accessor: "collected_next_week", type: "integer", show: true, required: true},
  //     ]},
  //     {Header: "Заказ позже", accessor: "order_next", type: "integer", show: true, required: true},
  //   ],
  //   []
  // );

  const columns = React.useMemo( () =>
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
    const [open, setOpen] = React.useState(false);
    const [itemId, setItemId] = React.useState(undefined);
    const [stockQty, setStockQty] = React.useState(undefined);

    const onRowClick = (row) => {
      setItemId(row.values.item_id);
      setStockQty(row.values.stock_now);
      setOpen(true);
    }
    const handleClose = () => {
      setOpen(false);
    };
  
  const { loading, error, data } = useSubscription(SUBSCRIPTION_STOCK);
  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const tableData=data.mr_pivot;

  // const rows = tableData.map( (obj) => {
  //   obj['id'] = obj['item_id'];
  //   delete obj['item_id'];
  //   return obj;
  // });
  console.log(tableData)

  return (
    <div>
      <div style={{ height: 700, width: '100%' }}>
        <DataGrid rows={tableData} columns={columns} />
      </div>
      <DialogOrders
        open={open}
        handleClose ={handleClose}
        item_id={itemId}
        stock_now={stockQty}
      />
    </div>
  )
}

export default Stock;
