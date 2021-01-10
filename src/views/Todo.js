import React from "react";
import Button from "@material-ui/core/Button";
import AddFromClipboard from "components/AddFromClipboard/AddFromClipboard";
import { useState } from "react";
// import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import {
  ADD_CUSTOMER,
  ADD_CATEGORY,
  ADD_PRICE,
  ADD_ORDER,
  ADD_ITEM,
  ADD_MOVING,
} from "../GraphQL/Mutations";

const Todo = () => {
  const [type, setType] = useState("category");
  // const [columns, setColumns] = useState([]);

  const [AddCustomer] = useMutation(ADD_CUSTOMER);
  const [AddCategory] = useMutation(ADD_CATEGORY);
  const [AddPrice] = useMutation(ADD_PRICE);
  const [AddOrder] = useMutation(ADD_ORDER);
  const [AddItem] = useMutation(ADD_ITEM);
  const [AddMove] = useMutation(ADD_MOVING);

  const mutations = {};
  mutations["customers"] = AddCustomer;
  mutations["category"] = AddCategory;
  mutations["price"] = AddPrice;
  mutations["orders"] = AddOrder;
  mutations["items"] = AddItem;
  mutations["move"] = AddMove;



  const columns = {};

  columns["customers"] = [
    {name:"text"},
    {town:"text"},
    {person:"text"},
    {phone:"text"},
    {email:"text"},
    {delivery:"text"},
    {discount:"number"},
    {first_order:"text"},
  ];

  columns["category"] = [{ name: "text" }];

  columns["price"] = [
    {name: "text"},
    {weight:"number"},
    {price_opt:"number"},
    {art:"text"},
    {category:"number"}, //ID
    {price_rozn:"number"},
  ];

  columns["orders"] = [
    {customer:"number"}, // id customer
    {town:"text"},
    {delivery:"text"},
    {person:"text"},
    {phone:"text"},
    {is_shipped:"boolean"}, // - boolean, default: false
    {date_in:"text"}, // - timestamp without time zone, nullable, default: now()
    {date_out:"text"}, // - timestamp with time zone, nullable
    {email:"text"}, // - text, nullable
    {discount:"number"}, // - numeric, nullable
    {is_cancelled:"boolean"}, // - boolean, nullable, default: false
    {note:"text"},
  ];

  columns["items"] = [
    { item: "number" }, // id price
    { qty: "number" },
    { order: "number" }, //id order
    { note: "text" },
    { is_cancelled: "boolean" }, // nullable
  ];

  columns["move"] = [
    {item:"number"}, //r
    {qty:"number"},
    {from_order:"number"}, // - integer
    {to_order:"number"}, // - integer
    {date:"text"}, // - timestamp with time zone, default: now()
  ];

  const onClick = (type) => {
    setType(type);
    console.log(columns[type]);
  };

  return (
    <div>
      <div>Выбери, какие данные импортировать</div>
      <Button
        color={type === "customers" ? "secondary" : "default"}
        onClick={() => onClick("customers")}
      >
        Заказчики
      </Button>
      <Button
        color={type === "category" ? "secondary" : "default"}
        onClick={() => onClick("category")}
      >
        Категории
      </Button>
      <Button color={type === "price" ? "secondary" : "default"} onClick={() => onClick("price")}>
        Прайс
      </Button>
      <Button color={type === "orders" ? "secondary" : "default"} onClick={() => onClick("orders")}>
        Заказы
      </Button>
      <Button color={type === "items" ? "secondary" : "default"} onClick={() => onClick("items")}>
        позиции в заказах
      </Button>
      <Button color={type === "move" ? "secondary" : "default"} onClick={() => onClick("move")}>
        Что набрано
      </Button>

      <AddFromClipboard type={type} value={columns[type]} onSubmit={mutations[type]} />
    </div>
  );
};

export default Todo;
