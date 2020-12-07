import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";


const GET_ORDERS = gql`
  query {
    orders {
      date_out
      town
      customer {
        name
        id
      }
    }
  }
`;

  const Orders = () => {
  

    const { loading, error, data } = useQuery(GET_ORDERS);
    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;
    
    console.log(data)
  
    return (
      <div>
        Orders
      </div>
    );
  }

export default Orders;
