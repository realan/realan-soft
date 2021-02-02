import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Fab from "@material-ui/core/Fab";
import { Box } from "@material-ui/core";

const useStyles = makeStyles({
  input: {
    width: 80,
  },
});

const InputGroup = ({onChange}) => {
  // console.log("renderInputWithBottons")
  const [count, setCount] = useState(0);

  const classes = useStyles();

  const increase = () => {
    setCount(count + 1);
    onChange(count + 1);
  };

  const decrease = () => {
    if (count - 1 >= 0) {
      setCount(count - 1);
      onChange(count - 1);
    }
  };

  const onChangeInput = (e) => {
    let val = e.target.value;
    if (val >= 0) {
      onChange(val);
    }
  };

  return (
    <>
      <Fab color="primary" aria-label="add" size="medium" component="span" onClick={decrease}>
        <RemoveIcon />
      </Fab>
      <Box display="inline" align="center">
        <OutlinedInput
          variant="outlined"
          type="number"
          value={count}
          onChange={onChangeInput}
          className={classes.input}
        />
      </Box>
      <Fab color="primary" aria-label="add" size="medium" component="span" onClick={increase}>
        <AddIcon />
      </Fab>
    </>
  );
};

export default InputGroup;
