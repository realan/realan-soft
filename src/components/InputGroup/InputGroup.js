import React  from "react";
import { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';


const InputGroup = (props) => {

    const [count, setCount] = useState(0);

    const increase = () => {
        if(count+1 > props.maxValue) {
          
        } else {
            props.onQtyChange(props.id, count + 1, props.type );
            setCount(count + 1)
        }
      }
  
    const decrease = () => {
        if(count-1 >= 0) { 
            props.onQtyChange(props.id, count - 1, props.type);
            setCount(count - 1); 
        }
    }
  
      const onChangeInput = (e) => {
        let val = e.target.value;
        if (val>=0 && val <= props.maxValue) {
            setCount(val);
            props.onQtyChange(props.id, val, props.type);
        }
      }
  
      const setMaxValue = () => {
        setCount(props.maxValue);
        props.onQtyChange(props.id, props.maxValue, props.type);
      }

    //   console.log(props.params)

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
          <IconButton color="primary" component="span" onClick = {setMaxValue}>
              <DoneAllIcon />
          </IconButton>  

        </>
    )
}

export default InputGroup;