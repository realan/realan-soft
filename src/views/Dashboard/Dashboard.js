import React from "react";
import { useState } from "react";
import SendMail from "components/SendMail/SendMail";
import moment from "moment";
import DateInterval from "components/DateInterval/DateInterval";
import ChartWidget from "components/ChartWidget/ChartWidget";
import OrdersWidget from "./OrdersWidget";

const Dashboard = () => {
  const [interval, setInterval] = useState({
    start: moment().startOf("isoWeek").toDate(),
    end: new Date(),
  });

  const handleDateChange = (date, type) =>
    setInterval((prevState) => ({ ...prevState, [type]: date }));

  return (
    <>
      <DateInterval start={interval.start} end={interval.end} onChange={handleDateChange} />
      <OrdersWidget />
      <ChartWidget />
      <SendMail />
    </>
  );
};

export default Dashboard;
