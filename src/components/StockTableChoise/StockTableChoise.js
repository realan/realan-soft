import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// const useStyles = makeStyles({
//   input: {
//     width: 65,
//   },
// });

const StockTableChoise = ({ value = "all", onChange }) => {
  // const [value, setValue] = React.useState('all');
  // const handleChange = (event) => {
  //   setValue(event.target.value);
  // };

  return (
    <>
      <RadioGroup
        aria-label="stock-table-choice"
        name="stockRadio"
        value={value}
        onChange={(event) => onChange(event)}
        row
      >
        <FormControlLabel value="all" control={<Radio />} label="Все" />
        <FormControlLabel value="needAllWeeks" control={<Radio />} label="Нужно" />
        <FormControlLabel value="stockNow" control={<Radio />} label="На складе" />
        <FormControlLabel value="needThisWeek" control={<Radio />} label="Эта неделя" />
      </RadioGroup>
    </>
  );
};

export default StockTableChoise;
