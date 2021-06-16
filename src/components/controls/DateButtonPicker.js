import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";
import Button from "@material-ui/core/Button";
// import { TextField } from "@material-ui/core";

const DateButtonPicker = ({ value = "", name, label = "", onChange }) => {
  const ButtonInput = forwardRef(({ value, onClick }, ref) => (
    <Button
      className="date-button-input"
      onClick={onClick}
      variant="outlined"
      color="primary"
      name={name}
      ref={ref}
    >
      {value || label}
    </Button>
  ));

  ButtonInput.displayName = "ButtonInput";

  const convertToDefEventPara = (name, value) => ({
    target: {
      name,
      value,
    },
  });

  return (
    <>
      <DatePicker
        selected={value}
        name={name}
        showWeekNumbers
        showMonthDropdown
        showYearDropdown
        scrollableYearDropdown
        placeholderText={label}
        locale={ru}
        // value={orderDate}
        onChange={(date) => onChange(convertToDefEventPara(name, date))}
        dateFormat="dd-MM-yyyy"
        customInput={<ButtonInput />}
      />
    </>
  );
};

export default DateButtonPicker;
