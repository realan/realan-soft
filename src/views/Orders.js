import React from "react";
import { useState, useMemo } from "react";
// import { XGrid } from '@material-ui/x-grid';
import { DataGrid } from '@material-ui/data-grid';
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import { renderProgress } from '@material-ui/x-grid-data-generator/'; 
import OrderDataDialog from "../components/OrderDataDialog/OrderDataDialog.js";
import Button from '@material-ui/core/Button';
// import FormTemplate from "forms/FormTemplate";
// import AddIcon from '@material-ui/icons/Add';

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

  const [open, setOpen] = useState(false);
  // const [openAddOrder, setOpenAddOrder] = useState(false);
  const [orderData, setOrderData] = useState({id: 1});

  const columns = useMemo( () =>
  [
    { field: 'id', headerName: 'id', width: 30 },
    { field: 'customer', headerName: 'Заказчик', type: "text", width: 200 },
    { field: 'town', headerName: 'Город', type: "text", width: 120 },
    { field: 'date_in', headerName: 'Заказан', type: "date", width: 110 },
    { field: 'date_out', headerName: 'Отгрузка', type: "date", width: 110 },
    { field: 'qty', headerName: 'Заказ,шт.', type: "number", width: 100 },
    { field: 'qtyRatio', headerName: 'Набрано', renderCell: renderProgress, width: 100 },
    { field: 'status', headerName: 'Статус', width: 50 },
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
    });
    
    const onRowClick = (row) => {
      setOrderData(row.row)
      setOpen(true)
    }

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        <Button>
          Добавить заказ
        </Button>
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
          orderData={orderData}
        />
        {/* <FormTemplate 
          fields={columns}

          header={"Введи закащ"}
          openIcon={<AddIcon />}
          onSubmit={}/> */}
      </>
    );
}

export default Orders;
