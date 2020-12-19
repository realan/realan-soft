import React  from "react";
import Button from '@material-ui/core/Button';
// import Button from "components/CustomButtons/Button.js";
import Input from '@material-ui/core/Input';
// import AddCircleIcon from '@material-ui/icons/AddCircle';
import TextField from '@material-ui/core/TextField';


const RowCollectOrder = (props) => {
    
    const [count, setCount]= React.useState(0);
    const [disabled, setDisabled]= React.useState(false);

    const date = new Date(props.date).getDate();
    const month = new Date(props.date).getMonth()+1;
    const needQty = props.orderQty - props.collectQty

    const increase = () => {
      if(count+1 > needQty) {
        
      } else {
        setCount(count + 1)
      }
    }

    const decrease = () => {
      if(count-1 >= 0) { 
        setCount(count - 1) 
      }
    }

    const onChangeInput = (e) => {
      let val = e.target.value;
      if (val>=0 && val <= needQty) {
        setCount(e.target.value)
      }
    }
    const onCollectAllClick = () => {
      setCount(needQty)
    }

    const onMakeMoveClick = () => {
      
    }

    return (
        <>
            <td> {props.customer}</td>
            <td> {props.town}</td>
            <td> {date}.{month} </td>
            <td> {props.orderQty}</td>
            <td> {props.collectQty}</td>
            <td> 
              <Button 
                size="small"
                color="primary"
                variant="outlined"
                onClick={decrease}
              >-</Button>
              {/* <TextField
                id="standard-number"
                label="Number"
                type="number"
                value={count}
                onChange={onChangeInput}
                InputLabelProps={{
                  shrink: true,
                }}
              /> */}
              <Input 
                variant="outlined"
                type="number" 
                value={count}
                onChange={onChangeInput}
                style = {{width: 50}}
              />
              <Button 
                size="small"
                variant="contained"
                color="primary"
                onClick={increase}
              >+</Button>
            </td>
            <td> 
              <Button 
                simple 
                color="primary"
                variant="outlined"
                onClick={onCollectAllClick}
              >Закрыть</Button>
            </td>
            <td> 
              <Button
                color="primary"
                variant="contained"
              >Провести</Button>
            </td>
            <td>{props.note}</td>
        </>
    )

}


export default RowCollectOrder;