import React from "react";
import "react-dadata/dist/react-dadata.css";
import AddCustomer from "components/AddCustomer/AddCustomer";
import CustomersTable from "./DataView/CustomersTable";
import CustomersAccordion from "./DataView/CustomersAccordion";

const Customers = () => {
  return (
    <div>
      <AddCustomer />
      <CustomersAccordion />
      <CustomersTable />
    </div>
  );
};

export default Customers;
