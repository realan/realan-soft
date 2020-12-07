import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";


const GET_CUSTOMERS = gql`
  query {
    customers {
      id
      name
      town
      firms{
        id
        name_full
      }
      shops {
        id
        name
      }
    }
  }
`;

  const Orders = () => {
  

    const { loading, error, data } = useQuery(GET_CUSTOMERS);
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
