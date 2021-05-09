import React from "react";
import { useEffect } from "react";
import { gql } from "apollo-boost";
import { useLazyQuery } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";

// const ADD_ORDER = gql`
//   mutation AddOrder($addData: orders_insert_input!) {
//     insert_orders_one(object: $addData) {
//       id
//     }
//   }
// `;

const GET_LAST_DOC_NUMBER = gql`
  query getLastDocNumber($year: Int!, $our_firm_id: Int!, $type_doc_id: Int!) {
    register(
      where: {
        year: { _eq: $year }
        our_firm_id: { _eq: $our_firm_id }
        type_doc_id: { _eq: $type_doc_id }
      }
      limit: 1
      order_by: { number: desc }
    ) {
      number
    }
  }
`;

export default function TryButon() {
  const docVars = {
    year: 2021,
    our_firm_id: 1,
    type_doc_id: 1,
  };

  const [getLastDocNumber, { data: dataNumber, loading: loadingNumber, error }] = useLazyQuery(
    GET_LAST_DOC_NUMBER,
    {
      variables: {
        year: docVars.year,
        our_firm_id: docVars.our_firm_id,
        type_doc_id: docVars.type_doc_id,
      },
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (dataNumber) {
      let number = 1;
      if (dataNumber.register[0]) {
        number = dataNumber.register[0].number;
      }
      console.log(number);
      //   setOrderData((prevState) => ({ ...prevState, number: dataNumber.register[0].number }));
    }
  }, [dataNumber]);

  if (loadingNumber) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleSubmit = () => {
    getLastDocNumber();
  };

  return (
    <Button variant="contained" color="primary" onClick={handleSubmit}>
      Нажми
    </Button>
  );
}
