import React  from "react";
import Button from '@material-ui/core/Button';

// import Button from "components/CustomButtons/Button.js";
import Input from '@material-ui/core/Input';
// import AddCircleIcon from '@material-ui/icons/AddCircle';
// import TextField from '@material-ui/core/TextField';


const RowCollectOrder = (props) => {
    
    const [count, setCount]= React.useState(0);
    const [countStock, setCountStock]= React.useState(0);

    // const [disabled, setDisabled]= React.useState(false);

    const date = new Date(props.date).getDate();
    const month = new Date(props.date).getMonth()+1;
    const needQty = props.orderQty - props.collectQty

// Process stock
const increaseStock = () => {
  if(countStock+1 > needQty - count) {
    
  } else {
    props.onStockQtyChange(props.id, countStock + 1 );
    setCountStock(countStock + 1)
    
  }
}

const decreaseStock = () => {
  if(countStock-1 >= 0) { 
    props.onStockQtyChange(props.id, countStock - 1);
    setCountStock(countStock - 1); 
  }
}

const onChangeInputStock = (e) => {
  let val = e.target.value;
  if (val>=0 && val <= needQty - count) {
    setCountStock(val);
    props.onStockQtyChange(props.id, val);
  }
}

const onCollectAllStockClick = () => {
  setCountStock(needQty - count);
  props.onStockQtyChange(props.id, needQty - count);
}



//process production
    const increase = () => {
      if(count+1 > needQty - countStock) {
        
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
      if (val>=0 && val <= needQty - countStock) {
        setCount(val);
        props.onQtyChange(props.id, val);
      }
    }

    const onCollectAllClick = () => {
      setCount(needQty - countStock);
      props.onQtyChange(props.id, needQty - countStock);
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
                style = {{minWidth: 30}}
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
                style = {{minWidth: 30}}
              >+</Button>
              <Button 
                size="small"
                color="primary"
                variant="contained"
                onClick={onCollectAllClick}
                style = {{minWidth: 50}}
              >++</Button>
            </td>
            <td>
            <Button 
                size="small"
                color="secondary"
                variant="outlined"
                onClick={decreaseStock}
                style = {{minWidth: 30}}
              >-</Button>
              <Input 
                variant="outlined"
                type="number" 
                value={countStock}
                onChange={onChangeInputStock}
                style = {{width: 50}}
              />
              <Button 
                size="small"
                variant="contained"
                color="secondary"
                onClick={increaseStock}
                style = {{minWidth: 30}}
              >+</Button>
              <Button 
                size="small"
                color="secondary"
                variant="contained"
                onClick={onCollectAllStockClick}
                style = {{minWidth: 50}}
              >++</Button>
            </td>
            <td>{props.note}</td>
        </> 
    )

}


export default RowCollectOrder;





