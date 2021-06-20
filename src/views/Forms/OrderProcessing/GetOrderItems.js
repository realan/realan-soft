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
      // let noteColumn;

      let header = arr[0].split("\t");
      header.forEach(function (item, i) {
        if (item === "Товар" || item === "Товар\r") {
          header[i] = "name";
        }
        if (item === "Модель" || item === "Модель\r") {
          header[i] = "art";
          artColumn = i;
        }
        if (item === "Кол-во" || item === "Кол-во\r") {
          header[i] = "qty";
          qtyColumn = i;
        }
        if (
          item === "примечание" ||
          item === "Примечание" ||
          item === "примечание\r" ||
          item === "note"
        ) {
          header[i] = "note";
          // noteColumn = i;
        }
        if (item === "Цена" || item === "Цена за ед.") {
          header[i] = "price";
          priceColumn = i;
        }
        if (item === "Итого" || item === "Всего") {
          header[i] = "sum";
        }
      });

      // console.log(header);

      arr.forEach(function (line, i) {
        if (line) {
          if (i !== 0) {
            // let row = [];
            let rowIn = line.split("\t");
            let obj = {};
            let haveArt = true;
            let art = "";
            rowIn.forEach(function (cell, j) {
              let itId = undefined;
              switch (j) {
                case qtyColumn:
                  obj[header[j]] = Number(cell);
                  break;
                case priceColumn:
                  //let val = cell.replace("руб.", "").replace(" ", "");
                  obj[header[j]] = Number(cell.replace("руб.", "").replace(" ", ""));
                  break;
                case artColumn:
                  art = cell.trim();
                  obj[header[j]] = cell.trim();
                  // check art in price, if not - skip add
                  if (price.find((item) => item.art === art)) {
                    itId = price.find((item) => item.art === art).id;
                    obj["itemId"] = itId;
                  } else {
                    console.log("art", i, art);
                    haveArt = false;
                  }
                  break;
                default:
                  obj[header[j]] = cell.trim();
                  break;
              }

              // if (j === qtyColumn) {
              //   obj[header[j]] = Number(cell);
              // } else if (j === priceColumn) {
              //   let val = cell.replace("руб.", "").replace(" ", "");
              //   obj[header[j]] = Number(val);
              // } else if (j === artColumn) {
              //   let art = cell.trim();
              //   obj[header[j]] = art;
              //   if (price.find((item) => item.art === art)) {
              //     let itId = price.find((item) => item.art === art).id;
              //     obj["itemId"] = itId;
              //   } else {
              //     haveArt = false;
              //   }
              // } else {
              //   obj[header[j]] = cell.trim();
              // }
              // if (haveArt) {
              //   row.push(obj);
              // } else {
              //   console.log("В прайсе нет позиции с артикулом ", art);
              //   alert("В прайсе нет позиции с артикулом ", art);
              // }
            });
            if (haveArt) {
              obj.id = i;
              result.push(obj);
            } else {
              // console.log("В прайсе нет позиции с артикулом ", art);
              alert("В прайсе нет позиции с артикулом " + art);
            }
          }
        }
      });

      // console.log(result);

      let itemsOrder = result.map((item, index) => {
        const inPrice = price.find((el) => el.id === item.itemId);
        // console.log(inPrice);
        // console.log(index);
        return {
          id: index,
          item_id: item.itemId,
          art: item.art,
          name: item.name,
          qty: item.qty,
          note: item.note,
          weight: inPrice.weight,
          price_in: inPrice.price_dealer * (1 - inPrice.supplier?.our_discount),
          price_dealer: inPrice.price_dealer,
          price_opt: inPrice.price_opt,
          price_retail: inPrice.price_retail,
        };
      });
      console.log("itemsOrder", itemsOrder);
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
