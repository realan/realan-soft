import React  from "react";
import Button from '@material-ui/core/Button';
// import Button from "components/CustomButtons/Button.js";
import Input from '@material-ui/core/Input';
// import AddCircleIcon from '@material-ui/icons/AddCircle';
// import TextField from '@material-ui/core/TextField';


const RowCollectOrder = (props) => {
    
    const [count, setCount]= React.useState(0);
    // const [disabled, setDisabled]= React.useState(false);

    const date = new Date(props.date).getDate();
    const month = new Date(props.date).getMonth()+1;
    const needQty = props.orderQty - props.collectQty

    const increase = () => {
      if(count+1 > needQty) {
        
      } else {
        props.onQtyChange(props.id, count + 1 );
        setCount(count + 1)
        
      }
    }

    const decrease = () => {
      if(count-1 >= 0) { 
        props.onQtyChange(props.id, count - 1);
        setCount(count - 1); 
      }
    }

    const onChangeInput = (e) => {
      let val = e.target.value;
      if (val>=0 && val <= needQty) {
        setCount(val);
        props.onQtyChange(props.id, val);
      }
    }

    const onCollectAllClick = () => {
      setCount(needQty);
      props.onQtyChange(props.id, needQty);
    }

    return (
        <>
            <td> {props.customer}</td>
            <td> {props.town}</td>
            <td> {date}.{month} </td>
            <td> {props.orderQty}</td>
            <td> {needQty}</td>
            <td> 
              <Button 
                size="small"
                color="primary"
                variant="outlined"
                onClick={decrease}
              >-</Button>
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
                color="primary"
                variant="outlined"
                onClick={onCollectAllClick}
              >Закрыть</Button>
            </td>
            {/* <td> 
              <Button
                color="primary"
                variant="contained"
              >Провести</Button>
            </td> */}
            <td>{props.note}</td>
        </> 
    )

}


export default RowCollectOrder;





