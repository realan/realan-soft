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

const InputGroup = ({id, minimValue, maxValue, type, onChange}) => {
  console.log("render InputGroup")
  // props id, type (stock or prod), maxValue, minValue onChange -
  // const [count, setCount] = useState(0);
  const minValue = minimValue || 0;

  const [state, setState] = useState({
    count: 0,
    disabledDecrease: 0 <= minValue ? true : false,
    disabledIncrease: 0 >= maxValue ? true : false,
    disabledMAxValue: 0 >= maxValue ? true : false,
  });

  const color = type === "stock" ? "primary" : "default";


  // const increase = () => {
  //   if (state.count + 1 > maxValue) {
  //   } else {
  //     onChange(id, state.count + 1, type);
  //     // setCount(count + 1);
  //     let c = state.count + 1;
  //     setState({
  //       count: c,
  //       disabledDecrease: c <= minValue ? true : false,
  //       disabledIncrease: c >= maxValue ? true : false,
  //       disabledMAxValue: c >= maxValue ? true : false,
  //     });
  //   }
  // };

  // const decrease = () => {
  //   if (state.count - 1 >= minValue) {
  //     onChange(id, state.count - 1, type);
  //     // setCount(count - 1);
  //     let c = state.count - 1;
  //     setState({
  //       count: c,
  //       disabledDecrease: c <= minValue ? true : false,
  //       disabledIncrease: c >= maxValue ? true : false,
  //       disabledMAxValue: c >= maxValue ? true : false,
  //     });
  //   }
  // };

  
  // const setMaxValue = () => {
  //   // setCount(props.maxValue);
  //   setState({...state, count: maxValue})
  //   onChange(id, maxValue, type);
  // };

  // //   console.log(props)

  const onClick = (event) => {
    const buttonType = "increase"
    const elemId = event.target.id;
    console.log(event)
    let c = 0;
    let flag = true;
    if (buttonType === 'increase') {
      c = state.count + 1;
      (c > maxValue) ? flag = false : flag = true;
    } else if (buttonType === 'decrease') {
      c = state.count - 1;
      // console.log(c);
      (c < minValue) ? flag = false : flag = true;
    } else {
      c = maxValue;
    }
    console.log(buttonType, flag, c)
    if (flag) {
      setState({
        count: c,
        disabledDecrease: c <= minValue ? true : false,
        disabledIncrease: c >= maxValue ? true : false,
        disabledMaxValue: c >= maxValue ? true : false,
      });
      onChange(id, c, type);
    }
  }

  const onChangeInput = (e) => {
    let val = e.target.value;
    if (val >= minValue && val <= maxValue) {
      // setCount(val);
      let c = val;
      setState({
        count: c,
        disabledDecrease: c <= minValue ? true : false,
        disabledIncrease: c >= maxValue ? true : false,
        disabledMAxValue: c >= maxValue ? true : false,
      });
      onChange(id, c, type);
    }
  };




  return (
    <div>
      <Fab
        id="decrease"
        color={color}
        aria-label="add"
        size="medium"
        component="span"
        onClick={()=>onClick("decrease")}
        disabled={state.count <= minValue ? true : false}
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
        id="increase"
        color={color}
        aria-label="add"
        size="medium"
        component="span"
        onClick={onClick}
        disabled={state.count >= maxValue ? true : false}
      >
        <AddIcon />
      </Fab>
      <Fab
        id="maxValue"
        color={color}
        aria-label="add"
        size="medium"
        component="span"
        onClick={()=>onClick("maxValue")}
        disabled={state.count >= maxValue ? true : false}
      >
        <DoneAllIcon />
      </Fab>
    </div>
  );
};

export default InputGroup;
