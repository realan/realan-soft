import React from "react";
import { useState, useEffect } from 'react';
import { gql } from "apollo-boost";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

import { DataGrid } from '@material-ui/data-grid';

// import { XGrid } from '@material-ui/x-grid';
// import { DataGrid } from '@material-ui/data-grid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ru from 'date-fns/locale/ru';
// import FileItemsLoader from "../FileItemsLoader/FileItemsLoader";

// import { makeStyles } from '@material-ui/core/styles';

// import IconButton from '@material-ui/core/IconButton';
// import GroupAddIcon from '@material-ui/icons/GroupAdd';


import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField} from '@material-ui/core';


const SUBSCRIPTION_CUSTOMERS = gql`
    subscription SubscriptionsCustomers {
        mr_customer {
            id
            name
            town
            phone
            person
            email
            delivery
            discount
        }
    }
`;


const ADD_CUSTOMER = gql`
  mutation AddCustomer ($addData: mr_customer_insert_input!){
    insert_mr_customer (objects: [$addData]) 
    {
      affected_rows      
        returning {
            id
      }
    }
  }
`;

const ADD_ORDER = gql`
  mutation AddOrder ($addData: mr_order_insert_input!){
    insert_mr_order (objects: [$addData]) 
    {
      affected_rows      
        returning {
            id
      }
    }
  }
`;

const ADD_ITEMS = gql`
  mutation AddItems ($addData: mr_items_insert_input!){
    insert_mr_items (objects: [$addData]) 
    {
      affected_rows      
        returning {
            id
      }
    }
  }
`;

// const useStyles = makeStyles((theme) => ({
//     root: {
//       padding: '2px 4px',
//       display: 'flex',
//       alignItems: 'center',
//       width: 400,
//     },
//     input: {
//       marginLeft: theme.spacing(1),
//       flex: 1,
//     },
//     iconButton: {
//       padding: 10,
//     },
//     divider: {
//       height: 28,
//       margin: 4,
//     },
//   }));


function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
}

const DialogAddOrder = (props) => {

    // const classes = useStyles();

    const initialDialogState = {
        customer: undefined,
        town: "",
        person: "",
        phone: "",
        email: "",
        delivery: "",
        discount: 0,
        date_in: new Date(),
        date_out: null        
    }

    const [orderData, setOrderData] = useState(initialDialogState);
    const [newCustomer, setNewCustomer] = useState({
        name:"",
        town: "",
        person: "",
        phone: "",
        email: "",
        delivery: "",
        discount: 0,
    });
    const [options, setOptions] = useState([])
    const [openAddCustomer, setOpenAddCustomer] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
    const [pr, setPr] = useState();


    const { loading, error, data } = useSubscription(SUBSCRIPTION_CUSTOMERS);
    const [AddCustomer] = useMutation(ADD_CUSTOMER);
    const [AddOrder] = useMutation(ADD_ORDER);
    const [AddItems] = useMutation(ADD_ITEMS);

    const columns = [
        { field: 'id', headerName: 'id', width: 30 },
        { field: 'name', headerName: 'Наименование', type: "text", width: 200 },
        { field: 'art', headerName: 'Артикул', type: "text", width: 100 },
        { field: 'qty', headerName: 'К-во', type: "number", width: 80 },
        { field: 'price', headerName: 'Цена', type: "number", width: 100 },
        { field: 'note', headerName: 'Примечание', type: "text", width: 200 },  
    ];

    useEffect(() => {
        if(!loading && data){
            setOptions(data.mr_customer);
        }
    }, [loading, data])
    
    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;

    const handleDateChange = (date, type) =>{
        if (type === "in") {
            setOrderData({...orderData, date_in: date})
        } else {
            setOrderData({...orderData, date_out: date})
        }
    }

    const handleAddOrder = () => {
        let orderId;
        AddOrder({ variables: {addData: orderData } })
            .then( data => (data.data.insert_mr_order.returning[0].id))
            .then( data => setPr(data))
            // .then( setOrderItems(orderItems.forEach( it => it["order"] = orderId )))

        console.log(pr)
    }

    const handleCloseAddCustomer = () => { setOpenAddCustomer(false) }
    
    const handleAddCustomer = () => { 
        if (newCustomer.name !== "") {
            AddCustomer({ variables: {addData: newCustomer } })
        };
        setOpenAddCustomer(false);
     }

    const handleAddCustomerChange = (type) => (event) => {
        setNewCustomer({...newCustomer, [type]: event.target.value })
    }


    const getInput = (event, val) => {
        console.log(val);
        if (val !== null) {
            setOrderData({...orderData, 
                customer: val.id,
                town: val.town,
                person: val.person,
                phone: val.phone,
                email: val.email,
                delivery: val.delivery,
                discount: val.discount,
            })
        }   

    }

    const handleDialogClose = () => {
        setOrderItems([]);
        setOrderData(initialDialogState);
        props.handleClose();
    }

    const parseClipboadToItems = () => {
        navigator.clipboard.readText().then( str => {
            let arr = str.split('\n');
            let result = [];
            
            let qtyColumn;
            let priceColumn;

            let header=arr[0].split('\t');
            header.forEach(function(item, i) { 
                if (item === "Товар") {header[i] = "name"}; 
                if (item === "Модель") {header[i] = "art"}; 
                if (item === "Кол-во") {
                    header[i] = "qty"; 
                    qtyColumn = i;
                }; 
                if (item ==="Цена" || item === "Цена за ед.") {
                    header[i] = "price";
                    priceColumn = i;
                }; 
                if (item === "Итого"|| item === "Всего") {header[i] = "sum"}; 
            });

            arr.forEach(function(line, i) {
            if (line) {
                if (i !== 0) {
                    let row = [];
                    let rowIn = line.split("\t"); 
                    let obj={};
                    rowIn.forEach(function(cell, j) {
                        // let obj = {};
                        if (j === qtyColumn) {
                            obj[header[j]] = Number(cell);
                        } else if (j === priceColumn) {
                            let val=cell.replace('руб.','').trim();
                            obj[header[j]] = Number(val);
                        } else {
                        obj[header[j]] = cell.trim();
                        };
                        row.push(obj);
                    });
                    obj.id = i;
                    result.push(obj);
                }
            }
            });
            console.log(result);
            setOrderItems(result);
        } );
    }

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                fullWidth={true}
                maxWidth="md"
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    <span>
                        Дата заказа
                        <DatePicker
                            selected={orderData.date_in}
                            // name={item.accessor}
                            showWeekNumbers
                            showMonthDropdown
                            placeholderText={'Дата заказа'}
                            locale={ru}
                            onChange={ date => {handleDateChange(date, "in") }}
                            dateFormat="dd-MM-yyyy"
                        />
                    </span>
                    <span>
                        Дата отгрузки
                        <DatePicker
                            selected={orderData.date_out}
                            // name={item.accessor}
                            showWeekNumbers
                            showMonthDropdown
                            placeholderText={'Дата отгрузки'}
                            locale={ru}
                            onChange={ date => {handleDateChange(date, "out") }}
                            dateFormat="dd-MM-yyyy"
                        />
                    </span>
                    <Button variant='outlined' color='primary' onClick={ () => setOpenAddCustomer(true)}>
                        Новый заказчик
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <Autocomplete
                        id="combo-box"
                        // open={true}
                        options={options.sort((a, b) => -b.town.localeCompare(a.town))}
                        groupBy={(option) => option.town}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        onChange={getInput}
                        renderInput={(params) => <TextField {...params} label="Заказчик" variant="outlined" />}
                    />
                    <TextField variant="outlined" value={orderData.town || ""}    type="text"    label="Город" />
                    <TextField variant="outlined" value={orderData.person || ""}  type="text"    label="Контактное лицо"/>
                    <TextField variant="outlined" value={orderData.phone || ""}   type="text"    label="Телефон" />
                    <TextField variant="outlined" value={orderData.email || ""}   type="email"   label="email" />
                    <TextField variant="outlined" value={orderData.delivery || ""} type="text"   label="ТК" />
                    <TextField variant="outlined" value={orderData.discount} type="number" label="Скидка" />


                    <div style={{ height: 600, width: '100%' }}> 
                        
                        Скопируй в буфер заказ - строку заголовка и позиции. Затем нажми кнопку
                        <Button variant='outlined' color="primary" onClick={parseClipboadToItems}>
                            Вставить позиции 
                        </Button>
                        <Button variant='outlined' color="secondary" onClick={() => setOrderItems([])}>
                            Очистить 
                        </Button>
                        <DataGrid
                            columns={columns}
                            rows={orderItems}
                            rowHeight={32}
                        />

                    </div>

                    <DialogContentText>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                
                    <Button onClick={handleDialogClose} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleAddOrder} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openAddCustomer}
                onClose={handleCloseAddCustomer}
                fullWidth={true}
                maxWidth="xs"
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Новый заказчик
                </DialogTitle>
                <DialogContent>
                    <TextField variant="outlined" fullWidth type="text"    onChange={handleAddCustomerChange('name')}     value={newCustomer.name}    label="Название" />
                    <TextField variant="outlined" fullWidth type="text"    onChange={handleAddCustomerChange('town')}     value={newCustomer.town}    label="Город" />
                    <TextField variant="outlined" fullWidth type="text"    onChange={handleAddCustomerChange('person')}   value={newCustomer.person}  label="Контактное лицо"/>
                    <TextField variant="outlined" fullWidth type="text"    onChange={handleAddCustomerChange('phone')}    value={newCustomer.phone}   label="Телефон" />
                    <TextField variant="outlined" fullWidth type="email"   onChange={handleAddCustomerChange('email')}    value={newCustomer.email}   label="email" />
                    <TextField variant="outlined" fullWidth type="text"    onChange={handleAddCustomerChange('delivery')} value={newCustomer.delivery} label="ТК" />
                    <TextField variant="outlined" fullWidth type="number"  onChange={handleAddCustomerChange('discount')} value={newCustomer.discount} label="Скидка" />

                    <DialogContentText>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddCustomer} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleAddCustomer} color="primary">
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default DialogAddOrder;