import React from "react";
import { useState } from "react";
import DateButton from "components/DateButton/DateButton";
import ModalResorting from "ModalResorting/ModalResorting";
import AddItemInOrder from "components/AddItemInOrder/AddItemInOrder";
import { DataGrid } from "@material-ui/data-grid";

const Orders = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState(new Date(today.getFullYear(), 0, 1));
  const [endDate, setEndDate] = useState(today);

  const columns = [
    { field: "id", headerName: "id", width: 30 },
    { field: "name", headerName: "Наименование", type: "text", width: 200 },
    { field: "art", headerName: "Артикул", type: "text", width: 100 },
    { field: "qty", headerName: "К-во", type: "number", width: 80 },
    { field: "price_opt", headerName: "Цена", type: "number", width: 100 },
    { field: "note", headerName: "Примечание", type: "text", width: 200 },
    // { field: "item_id", headerName: "ID Item", type: "number", width: 30 },
  ];
  const items = [
    {
      id: 1,
      name: "Хорёк",
      art: "kjkjh",
      qty: 1,
      price_opt: 255,
      note: "kjhkjh",
    },
    {
      id: 2,
      name: "Хорёк",
      art: "kjkjh",
      qty: 1,
      price_opt: 255,
      note: "kjhkjh",
    },
  ];

  return (
    <>
      <div>
        {"C "} <DateButton value={startDate} onChange={(date) => setStartDate(date)} />
        {"    По "}
        <DateButton value={endDate} onChange={(date) => setEndDate(date)} />
      </div>

      <ModalResorting startDate={startDate} endDate={endDate} />
      <AddItemInOrder orderId={181} />
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid columns={columns} rows={items} rowHeight={32} />
      </div>
    </>
  );
};

export default Orders;
