import React from "react";
// import Button from "@material-ui/core/Button";
import AddFromClipboard from "components/AddFromClipboard/AddFromClipboard";
import ImportButton from "components/ImportButton/ImportButton";
import { useState } from "react";
// import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { dataStructure } from "constants/dataStructure";
import {
  UPSERT_CATEGORY,
  UPSERT_CUSTOMERS,
  UPSERT_DOCUMENTS,
  UPSERT_FIRMS,
  UPSERT_ITEMS,
  UPSERT_MOVES,
  UPSERT_ORDERS,
  UPSERT_PERSONS,
  UPSERT_PRICE,
  UPSERT_SHOPS,
} from "../GraphQL/importDataMutations";
// import { UpsertMutations } from "../GraphQL/importDataMutations";

const ImportData = () => {
  const [type, setType] = useState("category");

  const [UpsertCategory] = useMutation(UPSERT_CATEGORY);
  const [UpsertCustomers] = useMutation(UPSERT_CUSTOMERS);
  const [UpsertDocuments] = useMutation(UPSERT_DOCUMENTS);
  const [UpsertFirms] = useMutation(UPSERT_FIRMS);
  const [UpsertItems] = useMutation(UPSERT_ITEMS);
  const [UpsertMoves] = useMutation(UPSERT_MOVES);
  const [UpsertOrders] = useMutation(UPSERT_ORDERS);
  const [UpsertPersons] = useMutation(UPSERT_PERSONS);
  const [UpsertPrice] = useMutation(UPSERT_PRICE);
  const [UpsertShops] = useMutation(UPSERT_SHOPS);

  const mutations = {};
  mutations["category"] = UpsertCategory;
  mutations["customers"] = UpsertCustomers;
  mutations["documents"] = UpsertDocuments;
  mutations["firms"] = UpsertFirms;
  mutations["items"] = UpsertItems;
  mutations["moves"] = UpsertMoves;
  mutations["orders"] = UpsertOrders;
  mutations["persons"] = UpsertPersons;
  mutations["price"] = UpsertPrice;
  mutations["shops"] = UpsertShops;

  // ["customers", "documents", "firms", "persons", "shops", "category", "price", "orders", "items", "moving"]

  const listButtons = Object.keys(dataStructure);
  console.log(listButtons);

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
