import React from "react";
import { useState } from "react";
import moment from "moment";
// import ModalOrderToSupplier from "./ModalOrderToSupplier";
import DateInterval from "components/DateInterval/DateInterval";
import UnorderedPositions from "./UnorderedPositions";
import NewSuplierOrder from "./NewSuplierOrder";
import OrdersSuppliersTable from "./OrdersSuppliersTable";

const Suppliers = () => {
  const [interval, setInterval] = useState({
    start: moment().startOf("isoWeek").toDate(),
    end: new Date(),
  });

  const handleDateChange = (date, type) =>
    setInterval((prevState) => ({ ...prevState, [type]: date }));

  return (
    <>
      <DateInterval start={interval.start} end={interval.end} onChange={handleDateChange} />
      {/* <ModalOrderToSupplier startDate={interval.start} endDate={interval.end} /> */}
      <NewSuplierOrder />
      <OrdersSuppliersTable />
      <UnorderedPositions startDate={interval.start} endDate={interval.end} />
    </>
  );
};

export default Suppliers;
