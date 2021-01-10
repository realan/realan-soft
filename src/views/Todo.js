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
    "name",
    "town",
    "person",
    "phone",
    "email",
    "delivery",
    "discount",
    "first_order",
  ];

  columns["category"] = [{ name: "text" }];

  columns["price"] = [
    "name",
    "weight",
    "price_opt",
    "art",
    "category", //ID
    "price_rozn",
  ];

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
    "note",
  ];

  columns["items"] = [
    { item: "number" }, // id price
    { qty: "number" },
    { order: "number" }, //id order
    { note: "text" },
    { is_cancelled: "boolean" }, // nullable
  ];

  columns["move"] = [
    "item", //r
    "qty",
    "from_order", // - integer
    "to_order", // - integer
    "date", // - timestamp with time zone, default: now()
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
