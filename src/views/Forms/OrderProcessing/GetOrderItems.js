import React from "react";
import { useState, useEffect } from "react";
// import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import { GET_PRICE } from "../../../GraphQL/Queries";

const GetOrderItems = ({ onChange }) => {
  const [price, setPrice] = useState([]);

  const { loading, error, data } = useQuery(GET_PRICE);

  useEffect(() => {
    if (!loading && data) {
      setPrice(data.price);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const parseClipboadToItems = () => {
    navigator.clipboard.readText().then((str) => {
      let arr = str.split("\n");
      let result = [];

      let qtyColumn;
      let priceColumn;
      let artColumn;

      let header = arr[0].split("\t");
      header.forEach(function (item, i) {
        if (item === "Товар") {
          header[i] = "name";
        }
        if (item === "Модель") {
          header[i] = "art";
          artColumn = i;
        }
        if (item === "Кол-во") {
          header[i] = "qty";
          qtyColumn = i;
        }
        if (item === "Цена" || item === "Цена за ед.") {
          header[i] = "price";
          priceColumn = i;
        }
        if (item === "Итого" || item === "Всего") {
          header[i] = "sum";
        }
      });

      arr.forEach(function (line, i) {
        if (line) {
          if (i !== 0) {
            let row = [];
            let rowIn = line.split("\t");
            let obj = {};

            rowIn.forEach(function (cell, j) {
              if (j === qtyColumn) {
                obj[header[j]] = Number(cell);
              } else if (j === priceColumn) {
                let val = cell.replace("руб.", "").replace(" ", "");
                obj[header[j]] = Number(val);
              } else if (j === artColumn) {
                let art = cell.trim();
                obj[header[j]] = art;
                let itId = price.find((item) => item.art === art).id;
                obj["itemId"] = itId;
              } else {
                obj[header[j]] = cell.trim();
              }
              row.push(obj);
            });
            obj.id = i;
            result.push(obj);
          }
        }
      });

      console.log(result);
      let itemsOrder = result.map((item, index) => {
        const inPrice = price.find((el) => el.id === item.itemId);
        return {
          id: index,
          item_id: item.itemId,
          art: item.art,
          name: item.name,
          qty: item.qty,
          note: item.note,
          weight: inPrice.weight,
          price_dealer: inPrice.price_dealer,
          price_opt: inPrice.price_opt,
          price_retail: inPrice.price_retail,
        };
      });
      onChange(itemsOrder);
    });
  };

  return (
    <Button variant="outlined" color="primary" onClick={parseClipboadToItems}>
      Заменить значениями из буфера
    </Button>
  );
};

export default GetOrderItems;
