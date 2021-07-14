import React from "react";
import "react-dadata/dist/react-dadata.css";
import AddCustomer from "components/AddCustomer/AddCustomer";
import CustomersTable from "./CustomersTable";
import CustomerForm from "./CustomerForm";
// import CustomersAccordion from "./CustomersAccordion";

const Customers = () => {
  return (
    <div>
      <AddCustomer />
      <CustomerForm />
      {/* <CustomersAccordion /> */}
      <CustomersTable />
    </div>
  );
};

export default Customers;
