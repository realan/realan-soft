import React  from "react";
import { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
// import DoneAllIcon from '@material-ui/icons/DoneAll';
// import IconButton from '@material-ui/core/IconButton';
// import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Fab from '@material-ui/core/Fab';
import { Box } from "@material-ui/core";

const InputGroup = (props) => {

    const [count, setCount] = useState(0);

    const increase = () => {
        setCount(count + 1);
        props.onChange(count + 1);
    }
  
    const decrease = () => {
        if(count-1 >= 0) { 
            setCount(count - 1);
            props.onChange(count - 1); 
        }
    }
  
      const onChangeInput = (e) => {
        let val = e.target.value;
        if (val >= 0) {
            setCount(val);
            props.onChange(val);
        }
      }

    return ( 
        <>
            <Fab color="primary" aria-label="add" size="medium" component="span" onClick = {decrease}>
                <RemoveIcon/>
            </Fab>  
            <Box display="inline" align="center">
                <OutlinedInput 
                    variant="outlined"
                    type="number" 
                    value={count}
                    onChange={onChangeInput}
                    style = {{width: 80}}
                />
            </Box>
            <Fab color="primary" aria-label="add" size="medium" component="span" onClick = {increase}>
                <AddIcon />
            </Fab>
        </>
    )
}

export default InputGroup;