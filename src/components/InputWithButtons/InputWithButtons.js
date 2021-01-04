import React  from "react";
import { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
// import DoneAllIcon from '@material-ui/icons/DoneAll';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';


const InputGroup = (props) => {

    const [count, setCount] = useState(0);

    const increase = () => {
        setCount(count + 1);
        props.onQtyChange(count + 1);
    }
  
    const decrease = () => {
        if(count-1 >= 0) { 
            setCount(count - 1);
            props.onQtyChange(count - 1); 
        }
    }
  
      const onChangeInput = (e) => {
        let val = e.target.value;
        if (val>=0) {
            setCount(val);
            props.onQtyChange(val);
        }
      }

    return ( 
        <>
            <IconButton color="primary" component="span" onClick = {decrease}>
                <RemoveIcon/>
            </IconButton>  
            <Input 
                variant="outlined"
                type="number" 
                value={count}
                onChange={onChangeInput}
                style = {{width: 50}}
            />
            <IconButton color="primary" component="span" onClick = {increase} >
                <AddIcon />
            </IconButton>  
        </>
    )
}

export default InputGroup;