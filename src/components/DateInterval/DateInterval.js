import React from "react";
import DateButton from "components/DateButton/DateButton";

const DateInterval = ({ start, end, onChange }) => {
  return (
    <>
      <div>
        {"C "} <DateButton value={start} onChange={(date) => onChange(date, "start")} />
        {"    По "}
        <DateButton value={end} onChange={(date) => onChange(date, "end")} />
      </div>
    </>
  );
};

export default DateInterval;
