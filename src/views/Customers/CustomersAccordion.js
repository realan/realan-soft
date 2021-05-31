import React, { useState, useEffect } from "react";
import { SUBSCRIPTION_CUSTOMERS } from "GraphQL/Subscriptions";
import CustomersDataView from "components/CustomerDataView/CustomerDataView";
import { useSubscription } from "@apollo/react-hooks";

export default function CustomersAccordion() {
  const [state, setState] = useState([]);

  const { loading, error, data } = useSubscription(SUBSCRIPTION_CUSTOMERS);

  useEffect(() => {
    if (!loading && data) {
      setState(data.customers);
    }
  }, [loading, data, setState]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const listCustomers = state.map((item) => (
    <div key={item.id}>
      <CustomersDataView value={item} />
    </div>
  ));

  return <>{listCustomers}</>;
}
