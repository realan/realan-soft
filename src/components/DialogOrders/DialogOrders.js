import React  from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
// import Table from "../Table/Table.js";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import RowCollectOrder from "components/RowCollectOrder/RowCollectOrder.js";



// const useStyles = makeStyles(styles);

const GET_ORDERS_BY_ID = gql`
  query QueryOrdersByItemId($item_id: Int!) {
        mr_items(where: {item: {_eq: $item_id}, mr_order: {is_shipped: {_eq: false}}}, order_by: {mr_order: {date_out: asc_nulls_last}}) {
            order
            qty
            note
            mr_order {
              id
              customer
              town
              date_out
              mr_customer {
                name
              }
              mr_to (where: {item: {_eq: $item_id}}){
                qty
              }
              mr_from(where: {item: {_eq: $item_id}}) {
                qty
              }
            }
        }
        mr_price(where: {id: {_eq: $item_id}}) {
            id
            name
        }
    }
`;

const ADD_MOVE = gql`
  mutation AddMove ($addData: mr_moving_insert_input!){
    insert_mr_moving (objects: [$addData]) 
    {
      affected_rows
    }
  }
`;

// mutation MyMutation {
//   insert_mr_moving(objects: {item: 10, qty: 10, from_order: 10, to_order: 10}) {
//     affected_rows
//   }
// }


function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
}

const DialogOrders = (props) => {
    // const classes = useStyles();
    const [dataDB, setDataDB] = React.useState( [] ); // для добавления в бд перемещений ассортимента

    const [AddMove] = useMutation(ADD_MOVE);

    let item_id=props.item_id;

    const { loading, error, data } = useQuery(
        GET_ORDERS_BY_ID,
        { variables: {item_id} }
    );

    React.useEffect(() => {
      if(!loading && data){
        setDataDB(data.mr_items.map( (ord) => {
            return {
              item: item_id,
              qty: 0, // initial value
              from_order: 3, // у склада ID = 3 - типа постоянное значение заказа !!!!!!!!
              to_order: ord.mr_order.id,
            }
        }));
      }
    }, [loading, data, item_id])

    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;
    
    console.log(dataDB)
 
    const handleOK = () => {
      // setDataDB({dataDB: convertToDB(data)})
      // AddMove({ variables: data }); 
    }



    const onQtyChange = () => {
      console.log("Эываыаыв")
    }

    const rowOrders=data.mr_items.map( (ord, key) => {

        let collectQty = ord.mr_order.mr_to.reduce( (sum, current) => sum + current.qty, 0) -
          ord.mr_order.mr_from.reduce( (sum, current) => sum + current.qty, 0);
        
        // const increase = () => {
        //     if(count+1 > needQty) {
              
        //     } else {
        //       setCount(count + 1)
        //     }
        // }
      
        // const decrease = () => {
        //     if(count-1 >= 0) { 
        //       setCount(count - 1) 
        //     }
        // }


        return (
          <tr key={key}>
            <RowCollectOrder
              customer={ord.mr_order.mr_customer.name}
              town={ord.mr_order.town}
              date={ord.mr_order.date_out}
              orderQty={ord.qty}
              collectQty={collectQty}
              note={ord.note}
              onQtyChange={onQtyChange}
            />
              {/* <td> {ord.mr_order.mr_customer.name}</td>
              <td> {ord.mr_order.town}</td>
              <td>{ord.mr_order.date_out}</td>
              <td> {ord.qty}</td>
              <td> {collectQty}</td>
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
            <td>{props.note}</td> */}
        </tr>
        )
    });

    //   /* Конвертируем данные для бд */
    // const convertToDB = (data) => {
    //   let arr = [];
    //   for (let j = 0; j < data.length; j++) {
    //       if (data.qty !== 0) { 
    //         let o = {};
    //         o.item = 10;
    //         o.qty = 10;
    //         o.from_order = 10;
    //         o.to_order = 10;
    //         arr.push(o);
    //       }
    //   }
    //   console.log('arr', arr);
    //   return arr;
    // };

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.PaperhandleClose}
                fullWidth={true}
                maxWidth="md"
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                  {data.mr_price[0].name}, на складе {props.stock_now} шт.
                </DialogTitle>
                <DialogContent>

                  <table>
                    <thead>
                      <tr>
                          <td> Заказчик</td>
                          <td> Город</td>
                          <td> Дата отгрузки</td>
                          <td> Заказано</td>
                          <td> Нужно</td>
                          <td> Добавляем</td>
                          <td> Набралось</td>
                          <td> Примечание</td>
                      </tr>
                    </thead>
                    <tbody>
                      {rowOrders}
                    </tbody>
                </table>

                {/* <Table
                  tableHead={["Заказчик","Город","Заказ","Дата отгрузки","Набрано"]}
                  tableData={[]}
                /> */}

                  <DialogContentText>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Отмена
                </Button>
                <Button onClick={handleOK} color="primary" variant="contained">
                    Подтвердить
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DialogOrders;
