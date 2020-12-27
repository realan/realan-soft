import React from "react";
import { XGrid } from '@material-ui/x-grid';
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";


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
    }
  }
`;


  const Orders = () => {

      const columns = React.useMemo( () =>
  [
    { field: 'id', headerName: 'id', width: 30 },
    { field: 'customer', headerName: 'Заказчик', width: 200 },
    { field: 'town', headerName: 'Город', width: 120 },
    { field: 'date_in', headerName: 'Заказан', width: 110 },
    { field: 'date_out', headerName: 'Отгрузка', width: 110 },
  ]
  , []);

    const { loading, error, data } = useSubscription(SUBSCRIPTION_ORDERS);
    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;

        let rows=[];
        data.mr_order.map( (it) => {
          const dateIn = new Date(it.date_in).toLocaleDateString();
          const dateOut = new Date(it.date_out).toLocaleDateString();
          let obj={
            id: it.id,
            customer: it.mr_customer.name,
            town: it.town,
            date_in: dateIn,
            date_out: dateOut,
          }
          rows.push(obj)
          return rows;
        })
    
    const onRowClick = (row) => {
      console.log(row.row)
    }

    return (
        <div style={{ height: 700, width: '100%' }}>
          <XGrid
            columns={columns}
            rows={rows}
            rowHeight={32}
            onRowClick={onRowClick}
            paginaton={true}
          />
        </div>
    );
  }

export default Orders;
