import React from "react";
import { useState } from "react";
import ModalResorting from "./ModalResorting";
import moment from "moment";
import ModalCompleteSet from "views/Stock/ModalCompleteSet";
import DateInterval from "components/DateInterval/DateInterval";
import LastPositionMovings from "./LastPositionMovings";

const StockDashboard = () => {
  const [interval, setInterval] = useState({
    start: moment().startOf("isoWeek").toDate(),
    end: new Date(),
  });

  const handleDateChange = (date, type) =>
    setInterval((prevState) => ({ ...prevState, [type]: date }));

  return (
    <>
      <DateInterval start={interval.start} end={interval.end} onChange={handleDateChange} />
      <ModalResorting startDate={interval.start} endDate={interval.end} />
      <ModalCompleteSet />
      <LastPositionMovings />
    </>
  );
};

export default StockDashboard;
