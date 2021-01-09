import React  from "react";
import Button from '@material-ui/core/Button';
import AddFromClipboard from "components/AddFromClipboard/AddFromClipboard";
import { useState } from 'react';

const Todo = () => {

  const [type, setType] = useState('customers');
  // const [columns, setColumns] = useState([]);

  const columns = {};

  columns["customers"]  = [
    "name",
    "town",
    "person",
    "phone",
    "email",
    "delivery",
    "discount",
    "first_order",
  ]

  columns["category"] = [
    "name"
  ]
  
  columns["price"] = [
    "name",
    "weight",
    "price_opt",
    "art",
    "category", //ID
    "price_rozn",
  ]

  columns["orders"] = [
    "customer", // id customer
    "town",
    "delivery",
    "person",
    "phone",
    "is_shipped", // - boolean, default: false
    "date_in", // - timestamp without time zone, nullable, default: now()
    "date_out", // - timestamp with time zone, nullable
    "email", // - text, nullable
    "discount", // - numeric, nullable
    "is_cancelled", // - boolean, nullable, default: false
  ]

  columns["items"] = [
    "item", // id price
    "qty", 
    "order", //id order
    "note",
    "is_cancelled", // nullable
  ]

  columns["move"] = [
    "item", //r
    "qty",
    "from_order", // - integer
    "to_order", // - integer
    "date", // - timestamp with time zone, default: now()
  ]

  const onClick = (type) => {
    setType(type);
    console.log(columns[type]);

  }
  // { () => {setType("customers"); setColumns(customers)}}

  return (
    <div>
        <div>Выбери, какие данные импортировать</div>
        <Button color = { type === "customers" ? "secondary" : "default" }
          onClick={() => onClick("customers")}
          >Заказчики</Button>
        <Button color = { type === "category" ? "secondary" : "default" }
          onClick={() => onClick("category")}
          >Категории</Button>
        <Button color = { type === "price" ? "secondary" : "default" }
          onClick={() => onClick("price")}
          >Прайс</Button>
        <Button color = { type === "orders" ? "secondary" : "default" }
          onClick={() => onClick("orders")}
          >Заказы</Button>
        <Button color = { type === "items" ? "secondary" : "default" }
          onClick={() => onClick("items")}
          >позиции в заказах</Button>
        <Button color = { type === "move" ? "secondary" : "default" }
          onClick={() => onClick("move")}
          >Что набрано</Button>

          <AddFromClipboard
            name={type} 
            columns={columns[type]}
          />


    </div>
  )
}

export default Todo;
