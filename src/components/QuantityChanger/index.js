import React from "react";
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

const QuantityChanger = ({
  minValue = 0,
  maxValue = 1000000,
  value,
  onChange,
  colorType = "primary",
}) => {
  
  const classes = useStyles();

  return (
    <div>
      <Fab
        color={colorType}
        aria-label="remove"
        size="small"
        component="span"
        onClick={() => onChange(value - 1)}
        disabled={value <= minValue}
      >
        <RemoveIcon />
      </Fab>

      <Box display="inline">
        <OutlinedInput
          variant="outlined"
          type="number"
          value={value}
          onChange={({ target }) => onChange(target.value)}
          className={classes.input}
        />
      </Box>

      <Fab
        color={colorType}
        aria-label="add"
        size="small"
        component="span"
        onClick={() => onChange(value + 1)}
        disabled={value >= maxValue}
      >
        <AddIcon />
      </Fab>

      <Fab
        color={colorType}
        aria-label="add"
        size="small"
        component="span"
        onClick={() => onChange(maxValue)}
        disabled={value >= maxValue}
      >
        <DoneAllIcon />
      </Fab>
    </div>
  );
};

export { QuantityChanger };
