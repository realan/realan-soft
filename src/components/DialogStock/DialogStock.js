import React from "react";
import { useState, useEffect } from 'react';
import { gql } from "apollo-boost";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import Button from '@material-ui/core/Button';
// import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
// import Table from "../Table/Table.js";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
// import RowCollectOrder from "components/RowCollectOrder/RowCollectOrder.js";
// import { DataGrid } from '@material-ui/data-grid';
// import InputGroup from "components/InputGroup/InputGroup";
import InputWithButtons from "components/InputWithButtons/InputWithButtons";
import CardPosInOrder from "components/CardPosInOrder/CardPosInOrder";
import Box from '@material-ui/core/Box';
import DialogStockCorrectQty from "components/DialogStockCorrectQty/DialogStockCorrectQty";
import { ADD_MOVE_ITEM } from '../../GraphQL/Mutations';

// const useStyles = makeStyles(styles);


const SUBSCRIPTION_ORDERS_BY_ID = gql`
  subscription SubscriptionsOrdersByItemId($item_id: Int!) {
    mr_items(where: {item: {_eq: $item_id}, mr_order: {is_shipped: {_eq: false}}}, order_by: {mr_order: {date_out: asc_nulls_last}}) {
        id
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
        mr_price {
          id
          name
        }
    }
  }
`;

function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
}

const DialogStock = (props) => {
  // const classes = useStyles();
  const [itemId, setItemId] = useState(undefined); 
  const [stockQty, setStockQty] = useState(0); // now in stock
  const [stockToProd, setStockToProd] = useState(0); 
  const [prodToStock, setProdToStock] = useState(0); 
  const [openCorrectQty, setOpenCorrectQty] = useState(false); 
  const [dataDB, setDataDB] = useState( [] ); // для добавления в бд перемещений ассортимента с производства и склада
                                              // id, item, qtyFromProd, qtyFromStock, to_order
                                             
 
  const [AddMove] = useMutation(ADD_MOVE_ITEM);

  // const getListCards = (cards) => cards.map((item, key) =>
  //   <CardPosInOrder 
  //     key={key}
  //     value = {item}
  //     stock = {stockQty}
  //     valueDB = {dataDB} //{dataDB[item.id].qtyFromStock}
  //     onChange = {onQtyChange}
  //   />
  // );

  // const columns = [
  //   { field: 'id', headerName: 'id', width: 10 },
  //   { field: 'customer', headerName: 'Заказчик', width: 150 },
  //   { field: 'town', headerName: 'Город', width: 110 },
  //   { field: 'dateOut', headerName: 'Дата отгрузки', width: 110 },
  //   { field: 'collected', headerName: 'Набрано%', type: "number", width: 10 },
  //   { field: 'orderQty', headerName: 'Заказ', type: "number", width: 80 },
  //   { field: 'needQty', headerName: 'Нужно', type: "number", width: 80 },
  //   { field: 'fromProd', headerName: 'С доработки', width: 200,
  //       renderCell: (params) => (
  //         <strong>
  //             <InputGroup 
  //               maxValue = {params.row.needQty}
  //               type = {"prod"}
  //               id = {params.rowIndex}
  //               onChange = {onQtyChange}
  //               params={params}
  //             />
  //         </strong>
  //     ), },
  //   { field: 'fromStock', headerName: 'Со склада', width: 200,
  //       renderCell: (params) => (
  //         <strong>
  //             <InputGroup 
  //               maxValue = {(stockQty < params.row.needQty) ? stockQty : params.row.needQty }
  //               type = {"stock"}
  //               id = {params.rowIndex}
  //               onChange = {onQtyChange}
  //             />
  //         </strong>
  //       ), },
  //   { field: 'note', headerName: 'Примечание', type: "text", width: 110 },
  // ];

 ;

  const { loading, error, data } = useSubscription(
    SUBSCRIPTION_ORDERS_BY_ID,
  { variables: {item_id: itemId} }
  );

  useEffect( ()=> {
    setItemId(props.item_id)
    setStockQty(props.stock_now)}, 
    [props.stock_now, props.item_id] 
  );

  useEffect(() => {
    if(!loading && data){
      setDataDB(data.mr_items.map( (ord) => {
        return {
          qtyFromProd: 0, // initial value
          qtyFromStock: 0, // initial value 
          to_order: ord.mr_order.id,
          item: itemId,
        }
      }));
      
    }
  }, [loading, data, itemId])

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleOK = () => {
    dataDB.map( (it) => {
      if (it.qtyFromProd !== 0) {
        console.log(it);
        let addData = {
          qty: it.qtyFromProd,
          to_order: it.to_order,
          from_order: 2, // у доработки ID = 2 - типа постоянное значение заказа !!!!!!!!
          item: it.item,
        };
        AddMove({ variables: {addData: addData } });
      }
      if (it.qtyFromStock !== 0) {
        console.log(it);
        let addData = {
          qty: it.qtyFromStock,
          to_order: it.to_order,
          from_order: 3, // у склада ID = 3 - типа постоянное значение заказа !!!!!!!!
          item: it.item,
        };
        AddMove({ variables: {addData: addData } });
      }
      return 1; //хз почему return
    })
    if (stockToProd > 0) {
      let addData = {
        qty: stockToProd,
        to_order: 2, // у доработки ID = 2 - типа постоянное значение заказа !!!!!!!!
        from_order: 3, // у склада ID = 3 - типа постоянное значение заказа !!!!!!!!
        item: itemId,
      }
      console.log(addData)
      AddMove({ variables: {addData: addData } });

    }
    if (prodToStock > 0) {
      let addData = {
        qty: prodToStock,
        to_order: 3, // у доработки ID = 2 - типа постоянное значение заказа !!!!!!!!
        from_order: 2, // у склада ID = 3 - типа постоянное значение заказа !!!!!!!!
        item: itemId,
      }
      console.log(addData)
      AddMove({ variables: {addData: addData } });
    }
    setProdToStock(0)
    setStockToProd(0)
    props.handleClose();
  };

  const handleCancel = () => {
    setStockQty(props.stock_now);
    props.handleClose();
  }
  const handleChangeStockToProd = (qty) => {
    setStockToProd(qty);
  }
  const handleChangeProdToStock = (qty) => {
    setProdToStock(qty);
  }
  
  let cards=[];
  let rows=[];

  data.mr_items.map( (it, key) => {
    // console.log(it)
    const dateOut = new Date(it.mr_order.date_out);
    let needQty = it.qty - (it.mr_order.mr_to.reduce( (sum, current) => sum + current.qty, 0) -
      it.mr_order.mr_from.reduce( (sum, current) => sum + current.qty, 0));

    let obj = {
      id: key, // it.id,
      orderId: it.mr_order.id,
      customer: it.mr_order.mr_customer.name,
      town: it.mr_order.town,
      dateOut: dateOut.toDateString(),
      // collected: qty,
      orderQty: it.qty,
      needQty: needQty,
      fromProd: 0, //it.qty,
      fromStock: 0, // it.qty,
      note: it.note,
    }
    rows.push(obj);
    cards.push(obj);
    return (rows, cards);
  });

  const onQtyChange = (id, qty, type) => {
    console.log(id, qty, type)
    console.log(dataDB);
    if (type === "prod"){
      setDataDB([...dataDB], dataDB[id].qtyFromProd = qty);
    } else {
      setDataDB([...dataDB], dataDB[id].qtyFromStock = qty);

      let sumQtyFromStock = dataDB.reduce( function (sum, elem) {return sum + elem.qtyFromStock}, 0);
      setStockQty(props.stock_now - sumQtyFromStock);
    }
  }

  const handleCorrectQty = (qty) => {
    setStockQty(qty);
    setOpenCorrectQty(false);
  }

  const listCards = cards.map((item, key) =>
        <CardPosInOrder 
          key={key}
          value = {item}
          stock = {stockQty}
          valueDB = {dataDB} //{dataDB[item.id].qtyFromStock}
          onChange = {onQtyChange}
        />
  );

  // let listCards = useMemo( () => getListCards(cards),[]);


  return (
    <div>
        <Dialog
            open={props.open}
            onClose={props.PaperhandleClose}
            fullScreen={true}
            maxWidth={false}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
            >
            <DialogTitle style={{ cursor: 'move'}} id="draggable-dialog-title">
              {data.mr_items[0].mr_price.name}
              <Button onClick={ () => setOpenCorrectQty(true)} color="primary" variant="outlined" style={{float: 'right'}}>
                На складе {stockQty} шт.
              </Button>
            </DialogTitle>
            <DialogContent>
              <Box         
                display="flex"
                flexWrap="wrap"
                m={1}
              >
                  {listCards}
              </Box>

              {/* <div style={{ height: 500, width: '100%' }}>
                <DataGrid 
                  rows={rows} 
                  columns={columns} 
                />
              </div> */}
              <div> Со склада в доработку  
                  <InputWithButtons 
                    onChange={handleChangeStockToProd}
                  />
                </div>
                
                <div> С доработки на склад  
                  <InputWithButtons 
                    onChange={handleChangeProdToStock}
                  />
                </div>

            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel} color="primary" variant="outlined">
                  Отмена
              </Button>
              <Button onClick={handleOK} color="primary" variant="contained">
                  Подтвердить
              </Button>
            </DialogActions>
        </Dialog>

        <DialogStockCorrectQty 
            open = {openCorrectQty}
            itemId = {data.mr_items[0].mr_price.id}s
            name = {data.mr_items[0].mr_price.name}
            stockNow = {stockQty}
            handleClose = {handleCorrectQty}
        />
              
    </div>
  )
}

export default DialogStock;
