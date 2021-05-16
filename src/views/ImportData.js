import React from "react";
// import Button from "@material-ui/core/Button";
import AddFromClipboard from "components/AddFromClipboard/AddFromClipboard";
import ImportButton from "components/ImportButton/ImportButton";
import { useState } from "react";
// import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { dataStructure } from "constants/dataStructure";
import {
  ADD_CUSTOMER,
  ADD_CATEGORY,
  ADD_PRICE,
  ADD_ORDER,
  ADD_ITEM,
  ADD_MOVING,
} from "../GraphQL/Mutations";

const ImportData = () => {
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

  console.log(dataStructure);

  columns["customers"] = [
    { name: "text" },
    { town: "text" },
    { person: "text" },
    { phone: "text" },
    { email: "text" },
    { delivery: "text" },
    { discount: "number" },
    { first_order: "text" },
  ];

  columns["category"] = [{ name: "text" }];

  columns["price"] = [
    { name: "text" },
    { weight: "number" },
    { price_opt: "number" },
    { art: "text" },
    { category: "number" }, //ID
    { price_rozn: "number" },
  ];

  columns["orders"] = [
    { customer: "number" }, // id customer
    { town: "text" },
    { delivery: "text" },
    { person: "text" },
    { phone: "text" },
    { is_shipped: "boolean" }, // - boolean, default: false
    { date_in: "text" }, // - timestamp without time zone, nullable, default: now()
    { date_out: "text" }, // - timestamp with time zone, nullable
    { email: "text" }, // - text, nullable
    { discount: "number" }, // - numeric, nullable
    { is_cancelled: "boolean" }, // - boolean, nullable, default: false
    { note: "text" },
  ];

  columns["items"] = [
    { item: "number" }, // id price
    { qty: "number" },
    { order: "number" }, //id order
    { note: "text" },
    { is_cancelled: "boolean" }, // nullable
  ];

  columns["move"] = [
    { item: "number" }, //r
    { qty: "number" },
    { from_order: "number" }, // - integer
    { to_order: "number" }, // - integer
    { date: "text" }, // - timestamp with time zone, default: now()
  ];

  const handleClick = (type) => {
    setType(type);
    // console.log(columns[type]);
  };

  // const importButton = ({ activeType, type, onClick }) => {
  //   return (
  //     <Button
  //       color={activeType === { type } ? "secondary" : "default"}
  //       onClick={() => onClick({ type })}
  //     >
  //       {type}
  //     </Button>
  //   );
  // };

  const listButtons = ["customers", "category", "price", "orders", "items", "move"];

  return (
    <div>
      <div>Выбери, какие данные импортировать</div>
      {listButtons.map((item) => (
        <ImportButton
          key={item.id}
          activeType={type}
          buttonType={item}
          onClick={() => handleClick(item)}
        />
      ))}
      <AddFromClipboard type={type} value={columns[type]} onSubmit={mutations[type]} />
    </div>
  );
};

export default ImportData;
