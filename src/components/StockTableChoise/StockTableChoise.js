import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles({
  input: {
    width: 65,
  },
});

const StockTableChoise = ({ 
        whatShow = "all",
        onChange,
    }) => {

  return (
      <>
        <RadioGroup
            aria-label="stock-table-choice"
            name="stockRadio"
            value={whatShow}
            onChange={onChange}
            row
        >
            <FormControlLabel value="all" control={<Radio />} label="Все" />
            <FormControlLabel value="needAll" control={<Radio />} label="Нужно" />
            <FormControlLabel value="stock" control={<Radio />} label="На складе" />
            <FormControlLabel value="week" control={<Radio />} label="Эта неделя" />
        </RadioGroup>
    </>
  );
}

export default StockTableChoise;
