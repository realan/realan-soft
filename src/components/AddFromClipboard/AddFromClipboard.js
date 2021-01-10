import React from "react";
import { useState } from "react";
// import { gql } from "apollo-boost";
// import { useQuery } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import { DataGrid } from "@material-ui/data-grid";

const AddFromClipboard = ({ type, value, onSubmit }) => {
  const [state, setState] = useState([]);

  const columns = value.map((item) => {
    let head = {};
    for (let key in item) {
      head["field"] = key;
      head["headerName"] = key;
    }
    return head;
  });

  const headsList = value.map((item) => Object.keys(item));

  // const columns = [
  //     { field: 'id', headerName: 'id', width: 30 },
  //     { field: 'name', headerName: 'Наименование', type: "text", width: 200 },   ]

  let result = [];

  const parseClipboad = () => {
    navigator.clipboard.readText().then((str) => {
      let arr = str.split("\n");

      // let header=arr[0].split('\t');
      // header.map( item => { return item; });

      // !!! вставить проверку, значения в массиве из пропса совпадает с заголовками с буфере по порядку

      arr.forEach(function (line, i) {
        if (line) {
          if (i !== 0) {
            let row = [];
            let rowIn = line.split("\t");
            let obj = {};

            rowIn.forEach(function (cell, j) {
              obj[headsList[j]] = cell.trim();
              console.log(obj);
              row.push(obj);
            });
            obj.id = i;
            result.push(obj);
          }
        }
      });
      console.log(result);
      setState(result);
    });
  };

  const insertInDb = () => {
    state.map((item) => {
      console.log(item);
      let addData = {};
      for (let key in value) {
        addData[key] = item[key];
      }

      // {
      //   qty: item.qtyFromProd,
      //   to_order: item.to_order,
      //   from_order: 2, // у доработки ID = 2 - типа постоянное значение заказа !!!!!!!!
      //   item: item.item,
      // };
      // AddMove({ variables: {addData: addData } });
    });
    onSubmit(type);
  };

  return (
    <div style={{ height: 600, width: "100%" }}>
      <div>Скопируй в буфер данные. Потом нажми кнопку</div>
      <Button variant="outlined" color="primary" onClick={parseClipboad}>
        Вставить из буфера
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => setState([])}>
        Очистить
      </Button>
      <Button variant="outlined" color="default" onClick={insertInDb}>
        Вставить в БД
      </Button>
      <DataGrid columns={columns} rows={state} rowHeight={32} />
    </div>
  );
};

export default AddFromClipboard;
