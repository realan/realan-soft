import React from 'react';
import { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DoneAllIcon from '@material-ui/icons/DoneAll';
// import IconButton from '@material-ui/core/IconButton';
// import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Fab from '@material-ui/core/Fab';
import { Box } from '@material-ui/core';

const InputGroup = (props) => {
  // props id, type (stock or prod), maxValue, minValue onChange -
  const [count, setCount] = useState(0);

  const minValue = props.minValue || 0;
  const color = props.type === 'stock' ? 'primary' : 'default';

  const increase = () => {
    if (count + 1 > props.maxValue) {
    } else {
      props.onChange(props.id, count + 1, props.type);
      setCount(count + 1);
    }
  };

  const decrease = () => {
    if (count - 1 >= minValue) {
      props.onChange(props.id, count - 1, props.type);
      setCount(count - 1);
    }
  };

  const onChangeInput = (e) => {
    let val = e.target.value;
    if (val >= minValue && val <= props.maxValue) {
      setCount(val);
      props.onChange(props.id, val, props.type);
    }
  };

  const setMaxValue = () => {
    setCount(props.maxValue);
    props.onChange(props.id, props.maxValue, props.type);
  };

  //   console.log(props)

  return (
    <div>
      <Fab color={color} aria-label="add" size="medium" component="span" onClick={decrease} 
        disabled={count <= props.minValue ? true : false }>
        <RemoveIcon />
      </Fab>
      <Box display="inline">
        <OutlinedInput
          variant="outlined"
          type="number"
          value={count}
          onChange={onChangeInput}
          style={{ width: 60 }}
        />
      </Box>

      <Fab color={color} aria-label="add" size="medium" component="span" onClick={increase}
        disabled={count >= props.maxValue ? true : false }>
        <AddIcon />
      </Fab>
      <Fab color={color} aria-label="add" size="medium" component="span" onClick={setMaxValue}
        disabled={count >= props.maxValue ? true : false }>
        <DoneAllIcon />
      </Fab>
    </div>
  );
};

export default InputGroup;
