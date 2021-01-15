import React from "react";
import { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import DoneAllIcon from "@material-ui/icons/DoneAll";
// import IconButton from '@material-ui/core/IconButton';
// import Input from '@material-ui/core/Input';
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Fab from "@material-ui/core/Fab";
import { Box } from "@material-ui/core";

const InputGroup = (props) => {
  console.log("render InputGroup")
  // props id, type (stock or prod), maxValue, minValue onChange -
  // const [count, setCount] = useState(0);
  const [state, setState] = useState({
    count: 0,
    disabledDecrease: 0 <= props.minValue ? true : false,
    disabledIncrease: 0 >= props.maxValue ? true : false,
    disabledMAxValue: 0 >= props.maxValue ? true : false,
  });

  const minValue = props.minValue || 0;
  const color = props.type === "stock" ? "primary" : "default";

  const increase = () => {
    if (state.count + 1 > props.maxValue) {
    } else {
      props.onChange(props.id, state.count + 1, props.type);
      // setCount(count + 1);
      setState({...state, count: state.count + 1})
    }
  };

  const decrease = () => {
    if (state.count - 1 >= minValue) {
      props.onChange(props.id, state.count - 1, props.type);
      // setCount(count - 1);
      setState({...state, count: state.count - 1})
    }
  };

  const onChangeInput = (e) => {
    let val = e.target.value;
    if (val >= minValue && val <= props.maxValue) {
      // setCount(val);
      setState({...state, count: val})
      props.onChange(props.id, val, props.type);
    }
  };

  const setMaxValue = () => {
    // setCount(props.maxValue);
    setState({...state, count: props.maxValue})
    props.onChange(props.id, props.maxValue, props.type);
  };

  //   console.log(props)



  return (
    <div>
      <Fab
        color={color}
        aria-label="add"
        size="medium"
        component="span"
        onClick={decrease}
        disabled={state.count <= props.minValue ? true : false}
      >
        <RemoveIcon />
      </Fab>
      <Box display="inline">
        <OutlinedInput
          variant="outlined"
          type="number"
          value={state.count}
          onChange={onChangeInput}
          style={{ width: 60 }}
        />
      </Box>

      <Fab
        color={color}
        aria-label="add"
        size="medium"
        component="span"
        onClick={increase}
        disabled={state.count >= props.maxValue ? true : false}
      >
        <AddIcon />
      </Fab>
      <Fab
        color={color}
        aria-label="add"
        size="medium"
        component="span"
        onClick={setMaxValue}
        disabled={state.count >= props.maxValue ? true : false}
      >
        <DoneAllIcon />
      </Fab>
    </div>
  );
};

export default InputGroup;
