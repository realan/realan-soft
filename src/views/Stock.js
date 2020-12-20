import React  from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import ReactTableExp from "../components/ReactTableExp/ReactTableExp";
import DialogOrders from "../components/DialogOrders/DialogOrders.js";

// import { XGrid } from '@material-ui/x-grid';

const SUBSCRIPTION_STOCK = gql`
  subscription {
    mr_pivot {
      item_id
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

  const columns = React.useMemo(
    () => [
      {Header: "id", accessor: "item_id", type: "integer", show: false, required: true},
      {Header: "Название", accessor: "item_name", type: "text", show: true, required: true},
      {Header: "На складе", accessor: "stock_now", type: "integer", show: true, required: true},
      {Header: "Эта неделя", columns: [  
        {Header: "Заказано", accessor: "order_this_week", type: "integer", show: true, required: true},
        {Header: "Набрано", accessor: "collected_this_week", type: "integer", show: true, required: true},
      ]}, 
      {Header: "Следующая неделя", columns: [  
        {Header: "Заказано", accessor: "order_next_week", type: "integer", show: true, required: true},
        {Header: "Набрано", accessor: "collected_next_week", type: "integer", show: true, required: true},
      ]},
      {Header: "Заказ позже", accessor: "order_next", type: "integer", show: true, required: true},
    ],
    []
  );

  // const columnsX = React.useMemo( () =>
  // [
  //   { field: 'item_id', headerName: 'id', width: 30 },
  //   { field: 'item_name', headerName: 'Название', width: 200 },
  //   { field: 'stock_now', headerName: 'Column 2', width: 50 },
  //   { field: 'order_this_week', headerName: 'Column 2', width: 60 },
  //   { field: 'collected_this_week', headerName: 'Column 2', width: 30 },
  //   { field: 'order_next_week', headerName: 'Column 2', width: 30 },
  //   { field: 'collected_next_week', headerName: 'Column 2', width: 30 },
  //   { field: 'order_next', headerName: 'Column 2', width: 30 },
  // ]
  // , []);

    //For modal dialog window
    const [open, setOpen] = React.useState(false);
    const [itemId, setItemId] = React.useState(undefined);
    const [stockQty, setStockQty] = React.useState(undefined);

    const onRowClick = (row) => {
      setItemId(row.values.item_id);
      setStockQty(row.values.stock_now);
      // console.log(itemId);
      // console.log(stockQty);
      // console.log(row.values);
      // console.log(row.values.stock_now);
      setOpen(true);
    }
    const handleClose = () => {
      setOpen(false);
    };
  
  const { loading, error, data } = useSubscription(SUBSCRIPTION_STOCK);
  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const dataTable = data.mr_pivot;
 
  // const tableData=data.mr_pivot;
  // const rows = tableData.map( (obj) => {
  //   obj['id'] = obj['item_id'];
  //   delete obj['item_id'];
  //   return obj;
  // });
  // console.log(rows)

  return (
    <div>
      <ReactTableExp
        columns={columns}
        data={dataTable}
        onRowClick={onRowClick}
      />

      {/* <XGrid rows={rows} columns={columnsX} /> */}
      
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
