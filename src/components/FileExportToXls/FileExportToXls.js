import { Button } from "@material-ui/core";
import React from "react";
import XLSX from "xlsx";

const convertToExport = (data) => {
  let arr = [];
  const obj = data[0] || {};
  const keys = Object.keys(obj);
  arr.push(keys);
  data.forEach((obj) => {
    let arrRow = [];
    keys.forEach((key) => arrRow.push(obj[key]));
    arr.push(arrRow);
  });
  return arr;
};

const FileExportToXls = ({ data, name }) => {
  const preparedData = convertToExport(data);

  const exportFile = () => {
    console.log(preparedData);
    /* convert state to workbook */
    const ws = XLSX.utils.aoa_to_sheet(preparedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, name);
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, name + ".xlsx");
  };

  return (
    <>
      <Button color="primary" variant="outlined" onClick={exportFile}>
        Экспорт
      </Button>
    </>
  );
};

export default FileExportToXls;
