import React from "react";
import { useState } from "react";
// import { gql } from "apollo-boost";
// import { useQuery } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import { DataGrid } from "@material-ui/data-grid";

const AddFromClipboard = ({ value, onSubmit }) => {
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
  const headsType = value.map((item) => item[Object.keys(item)]);

  let headsListClipboard = [];
  let headsTypesClipboard = [];

  let result = [];

  const parseClipboad = () => {
    navigator.clipboard.readText().then((str) => {
      let arr = str.split("\n");

      // !!! вставить проверку, значения в массиве из пропса совпадает с заголовками с буфере по порядку
      // console.log(arr);
      arr.forEach(function (line, i) {
        if (line) {
          if (i === 0) {
            let rowHead = line.split("\t");
            rowHead.forEach(function (cell) {
              let val = cell.trim();
              let index = headsList.findIndex((item) => item == val);
              // console.log(index);
              headsListClipboard.push(val);
              headsTypesClipboard.push(headsType[index]);
            });
          }
          if (i !== 0) {
            let row = [];
            let rowIn = line.split("\t");
            let obj = {};
            rowIn.forEach(function (cell, j) {
              let type = headsTypesClipboard[j];
              // let type = headsType[j];
              let val = cell.trim();
              if (type === "number") {
                if (val !== "") {
                  // obj[headsList[j]] = Number(val.replace(",", ".").replace(" ", ""));
                  obj[headsListClipboard[j]] = Number(val.replace(",", ".").replace(" ", ""));
                }
              } else if (type === "boolean") {
                val === "1" || val === "ИСТИНА" || val === "true" || val === true
                  ? (val = true)
                  : (val = false);
                // obj[headsList[j]] = val;
                obj[headsListClipboard[j]] = val;
              } else {
                if (val !== "") {
                  // obj[headsList[j]] = val;
                  obj[headsListClipboard[j]] = val;
                }
              }
              // console.log(obj);
              row.push(obj);
            });
            obj.id = i; //для вывода в таблицу. для Мутации убрать
            result.push(obj);
          }
        }
      });
      console.log(result);
      setState(result);
    });
  };
  // console.log(result);

  const insertInDb = () => {
    // let addData = [];
    // const addData=state.forEach((item) => {
    //   // console.log(item);
    //   for (let key in item) {
    //     let obj = {};
    //     if (key !== "id") {
    //       obj[key] = item[key];
    //     }
    //     addData.push(obj);
    //   }
    // });
    // console.log(addData);
    onSubmit({ variables: { addData: state } });
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
