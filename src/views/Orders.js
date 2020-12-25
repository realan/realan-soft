import React from "react";
import { XGrid } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";


const GET_ORDERS = gql`
  query {
    mr_order(where: {is_shipped: {_eq: false}}) {
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
    
    const { data } = useDemoData({
      dataSet: 'Commodity',
      rowLength: 100000,
    });

    // const { loading, error, data } = useQuery(GET_ORDERS);
    // if (loading) return "Loading....";
    // if (error) return `Error! ${error.message}`;
    
    console.log(data)

    return (
      <div>
        Orders
        <div style={{ height: 700, width: '100%' }}>
      <XGrid
        {...data}
        loading={data.rows.length === 0}
        rowHeight={32}
        checkboxSelection
      />
    </div>
      </div>
    );
  }

export default Orders;
