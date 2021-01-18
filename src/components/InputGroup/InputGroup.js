import React from "react";
import { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import RemoveIcon from "@material-ui/icons/Remove";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Fab from "@material-ui/core/Fab";
import { Box } from "@material-ui/core";

const useStyles = makeStyles({
  input: {
    width: 65,
  },
});

function InputGroup({ id, minValue, maxValue, type, onChange }) {
  const classes = useStyles();

  const [state, setState] = useState({
    count: 0,
    disabledDecrease: 0 <= minValue ? true : false,
    disabledIncrease: 0 >= maxValue ? true : false,
    disabledMaxValue: 0 >= maxValue ? true : false,
  });

  const color = type === "stock" ? "primary" : "default";

  const increase = () => {
    let c = state.count + 1;
    if (c > maxValue) {
    } else {
      onChange(id, c, type);
      setState({
        count: c,
        disabledDecrease: c <= minValue ? true : false,
        disabledIncrease: c >= maxValue ? true : false,
        disabledMaxValue: c >= maxValue ? true : false,
      });
    }
  };

  const decrease = () => {
    let c = state.count - 1;
    if (c >= minValue) {
      onChange(id, c, type);
      setState({
        count: c,
        disabledDecrease: c <= minValue ? true : false,
        disabledIncrease: c >= maxValue ? true : false,
        disabledMaxValue: c >= maxValue ? true : false,
      });
    }
  };

  const setMaxValue = () => {
    onChange(id, maxValue, type);
    setState({
      count: maxValue,
      disabledDecrease: maxValue <= minValue ? true : false,
      disabledIncrease: true,
      disabledMaxValue: true,
    });
  };

  const onChangeInput = (e) => {
    e.preventDefault();
    let c = e.target.value;
    if (c >= minValue && c <= maxValue) {
      setState({
        count: c,
        disabledDecrease: c <= minValue ? true : false,
        disabledIncrease: c >= maxValue ? true : false,
        disabledMaxValue: c >= maxValue ? true : false,
      });
      onChange(id, c, type);
    }
  };

  return (
    <div>
      <Fab
        color={color}
        aria-label="add"
        size="medium"
        component="span"
        onClick={decrease}
        disabled={state.disabledDecrease}
      >
        <RemoveIcon />
      </Fab>
      <Box display="inline">
        <OutlinedInput
          variant="outlined"
          type="number"
          value={state.count}
          onChange={onChangeInput}
          className={classes.input}
        />
      </Box>

      <Fab
        color={color}
        aria-label="add"
        size="medium"
        component="span"
        onClick={increase}
        disabled={state.disabledIncrease}
      >
        <AddIcon />
      </Fab>
      <Fab
        color={color}
        aria-label="add"
        size="medium"
        component="span"
        onClick={setMaxValue}
        disabled={state.disabledMaxValue}
      >
        <DoneAllIcon />
      </Fab>
    </div>
  );
}

export default InputGroup;
