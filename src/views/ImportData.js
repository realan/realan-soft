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
import { UPSERT_PRICE } from "../GraphQL/importDataMutations";

const ImportData = () => {
  const [type, setType] = useState("category");
  // const [columns, setColumns] = useState([]);

  const [AddCustomer] = useMutation(ADD_CUSTOMER);
  const [AddCategory] = useMutation(ADD_CATEGORY);
  const [AddPrice] = useMutation(ADD_PRICE);
  const [AddOrder] = useMutation(ADD_ORDER);
  const [AddItem] = useMutation(ADD_ITEM);
  const [AddMove] = useMutation(ADD_MOVING);

  const [UpsertPrice] = useMutation(UPSERT_PRICE);

  const mutations = {};
  mutations["customers"] = AddCustomer;
  mutations["category"] = AddCategory;
  mutations["price"] = UpsertPrice; //AddPrice;
  mutations["orders"] = AddOrder;
  mutations["items"] = AddItem;
  mutations["move"] = AddMove;

  // const handleClick = (type) => {
  //   setType(type);
  //   // console.log(columns[type]);
  // };

  const listButtons = Object.keys(dataStructure);

  return (
    <div>
      <div>Выбери, какие данные импортировать</div>
      {listButtons.map((item) => (
        <ImportButton
          key={item.id}
          activeType={type}
          buttonType={item}
          onClick={() => setType(item)}
        />
      ))}
      <AddFromClipboard
        // type={type}
        // value={columns[type]}
        value={dataStructure[type]}
        onSubmit={mutations[type]}
      />
    </div>
  );
};

export default ImportData;
