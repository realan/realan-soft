import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import moment from "moment";
import UpdateMove from "./UpdateMove";
import DeleteMove from "./DeleteMove";
import FileExportToXls from "components/FileExportToXls/FileExportToXls";
import DateInterval from "components/DateInterval/DateInterval";

const SUBSCRIPTION_MOVING = gql`
  subscription GetMoving($startDate: timestamp!, $endDate: timestamp!) {
    moving(
      where: { created_at: { _gte: $startDate, _lte: $endDate } }
      order_by: { created_at: desc }
    ) {
      id
      created_at
      price {
        id
        art
        name
      }
      from_order
      to_order
      qty
      note
      toOrder {
        customer_id
        city
        consignee_name
      }
      fromOrder {
        customer_id
        city
        consignee_name
      }
    }
  }
`;

function updateField(params) {
  return <UpdateMove value={params.row} />;
}
function deleteField(params) {
  return <DeleteMove value={params.row} />;
}

const StockHistory = () => {
  const [interval, setInterval] = useState({
    start: moment().startOf("isoWeek").toDate(),
    end: new Date(),
  });

  const [rows, setRows] = useState([]);

  const columns = [
    { field: "id", headerName: "id", width: 100 },
    { field: "date", headerName: "Дата", width: 150 },
    { field: "name", headerName: "Название", width: 250 },
    { field: "art", headerName: "Артикул", width: 100 },
    { field: "qty", headerName: "К-во", width: 100 },
    { field: "note", headerName: "Лоток/коробка", width: 200 },
    { field: "from_customer", headerName: "Из", width: 200 },
    { field: "to_customer", headerName: "В", width: 200 },
    { field: "from_order", headerName: "Из id", width: 100 },
    { field: "to_order", headerName: "В id", width: 100 },
    { field: "update", headerName: "Обновить", width: 80, renderCell: updateField },
    { field: "delete", headerName: "Удалить", width: 80, renderCell: deleteField },
  ];

  const { loading, error, data } = useSubscription(SUBSCRIPTION_MOVING, {
    variables: { startDate: interval.start, endDate: interval.end },
  });

  useEffect(() => {
    if (!loading && data) {
      // console.log(data);
      const preparedRows = data.moving.map((item) => {
        return {
          id: item.id,
          price_id: item.price.id,
          name: item.price.name,
          art: item.price.art,
          date: new Date(item.created_at),
          qty: item.qty,
          note: item.note,
          to_order: item.to_order,
          from_order: item.from_order,
          from_customer: item.fromOrder.consignee_name,
          to_customer: item.toOrder.consignee_name,
        };
      });
      setRows(preparedRows);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleDateChange = (date, type) =>
    setInterval((prevState) => ({ ...prevState, [type]: date }));

  return (
    <>
      <DateInterval start={interval.start} end={interval.end} onChange={handleDateChange} />
      {Boolean(rows.length) && (
        <div style={{ height: 900, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} rowHeight={32} />
        </div>
      )}
      <FileExportToXls data={rows} name={"Движения по складу"} />
    </>
  );
};

export default StockHistory;
