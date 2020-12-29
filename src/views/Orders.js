import React from "react";
import { useState, useMemo } from "react";
// import { XGrid } from '@material-ui/x-grid';
import { DataGrid } from '@material-ui/data-grid';
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import { renderProgress } from '@material-ui/x-grid-data-generator/'; 
import OrderDataDialog from "../components/OrderDataDialog/OrderDataDialog.js";

const SUBSCRIPTION_ORDERS = gql`
subscription {
  mr_order(where: {is_shipped: {_eq: false}}) {
    id
    customer
    town
    date_in
    date_out
    mr_customer {
      name
    }
    mr_items_aggregate {
      aggregate {
        sum {
          qty
        }
      }
    }
    mr_to_aggregate {
      aggregate {
        sum {
          qty
        }
      }
    }
    mr_from_aggregate {
      aggregate {
        sum {
          qty
        }
      }
    }
  }
}
`;


const Orders = () => {

        //For modal dialog window
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState(undefined);

  const columns = useMemo( () =>
  [
    { field: 'id', headerName: 'id', width: 30 },
    { field: 'customer', headerName: 'Заказчик', width: 200 },
    { field: 'town', headerName: 'Город', width: 120 },
    { field: 'date_in', headerName: 'Заказан', width: 110 },
    { field: 'date_out', headerName: 'Отгрузка', width: 110 },
    { field: 'qty', headerName: 'Заказ,шт.', width: 100 },
    { field: 'qtyRatio', headerName: 'Набрано', renderCell: renderProgress, width: 100 },

  ]
  , []);


    const { loading, error, data } = useSubscription(SUBSCRIPTION_ORDERS);
    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;

        let rows=[];
        data.mr_order.map( (it) => {
          const dateIn = new Date(it.date_in).toLocaleDateString();
          const dateOut = new Date(it.date_out).toLocaleDateString();
          let qty = it.mr_items_aggregate.aggregate.sum.qty;
          let qtyRatio = +((it.mr_to_aggregate.aggregate.sum.qty - it.mr_from_aggregate.aggregate.sum.qty)/qty).toFixed(3);

          let obj = {
            id: it.id,
            customer: it.mr_customer.name,
            town: it.town,
            date_in: dateIn,
            date_out: dateOut,
            qty: qty,
            qtyRatio: qtyRatio,
          }
          rows.push(obj)
          return rows;
        })
    
    const onRowClick = (row) => {
      setOrderId(row.row.id)
      setOpen(true)
      // console.log(row.row.id)
    }

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <div style={{ height: 700, width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            rowHeight={32}
            onRowClick={onRowClick}
            paginaton={true}
          />
        </div>
        <OrderDataDialog
          open={open}
          handleClose={handleClose}
          order_id={orderId}
        />
      </>
    );
}

export default Orders;
