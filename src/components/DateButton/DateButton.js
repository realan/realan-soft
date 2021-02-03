import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";
import Button from "@material-ui/core/Button";



const DateButton = ({value, placeholder = '', onChange}) => {

    const ButtonInput = ({ value, onClick }) => (
        <Button 
            className="date-button-input" 
            onClick={onClick}
            variant="outlined"
            color="primary"
        >
          {value || placeholder}
        </Button>
      );

     return (
        <>
        <DatePicker
            selected={value}
            // name={item.accessor}
            showWeekNumbers
            showMonthDropdown
            placeholderText={placeholder}
            locale={ru}
            // value={orderDate}
            onChange={(date) => { onChange(date) }}
            dateFormat="dd-MM-yyyy"
            customInput={<ButtonInput />}
          />
        </>

    );
}

export default DateButton;