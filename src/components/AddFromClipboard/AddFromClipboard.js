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

  // columns["items"] = [
  //   { item: "number" }, // id price
  //   { qty: "number" },
  //   { order: "number" }, //id order
  //   { note: "text" },
  //   { is_cancelled: "boolean" }, // nullable
  // ];

  const headsList = value.map((item) => Object.keys(item));
  const headsType = value.map((item) => item[Object.keys(item)]);

  console.log(headsType)
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
              let type = headsType[j]
              let val = cell.trim()
              if (type === "number") {
                obj[headsList[j]] = Number(val.replace(",",".").replace(" ", ""));
              } else if (type === "boolean") {
                (val === '1' || val === "ИСТИНА" || val === 'true' || val === true) ? val = true : val = false;
                obj[headsList[j]]=val;
              } else {
                obj[headsList[j]]=val;
              }
              // console.log(obj);
              row.push(obj);
            });
            obj.id = i; //для вывода в таблицу. для Мутации убрать
            result.push(obj);
          }
        }
      });
      // console.log(result);
      setState(result);
    });
  };
  console.log(result);

  const insertInDb = () => {
    state.forEach((item) => {
      // console.log(item);
      let addData = {};
      for (let key in item) {
        if (key !== 'id') {
          addData[key] = item[key];
        }  
      }


      console.log(addData);
      onSubmit({ variables: {addData: addData }});
      // {
      //   qty: item.qtyFromProd,
      //   to_order: item.to_order,
      //   from_order: 2, // у доработки ID = 2 - типа постоянное значение заказа !!!!!!!!
      //   item: item.item,
      // };
      // AddMove({ variables: {addData: addData } });
      // return true;
    });
    // onSubmit({ variables: {addData: addData }});
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
