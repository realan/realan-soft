import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import Box from "@material-ui/core/Box";
import FileExportToXls from "components/FileExportToXls/FileExportToXls";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const QUERY_GET_UNORDERED = gql`
  query GetUnorderedItems($startDate: timestamptz, $endDate: timestamptz) {
    items(
      where: {
        is_ordered: { _eq: false }
        order: { date_out: { _gte: $startDate, _lte: $endDate } }
      }
    ) {
      item_id
      id
      note
      order_id
      qty
      order {
        city
        customer_id
        customer {
          name
        }
        date_out
      }
      price {
        supplier {
          id
          name
        }
        art
        name
        price_dealer
      }
    }
  }
`;

const UnorderedPositions = ({ startDate, endDate }) => {
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "id", headerName: "id", width: 10 },
    { field: "item_name", headerName: "Название", width: 250 },
    { field: "item_art", headerName: "Артикул", width: 100 },
    { field: "qty", headerName: "К-во", width: 100 },
    { field: "note", headerName: "Примечание", width: 200 },
    { field: "price", headerName: "Цена", width: 150 },
    { field: "date_out", headerName: "Дата отгрузки", width: 150 },
    { field: "order_id", headerName: "order_id", width: 100 },
    { field: "customer_name", headerName: "Заказчик", width: 250 },
    { field: "city", headerName: "Город", width: 250 },
    { field: "suppler_name", headerName: "Поставщик", width: 250 },
  ];
  // console.log(startDate, endDate);
  const { loading, error, data } = useQuery(QUERY_GET_UNORDERED, {
    variables: {
      startDate: startDate,
      endDate: endDate,
    },
  });

  useEffect(() => {
    if (!loading && data) {
      // console.log(data);
      const preparedRows = data.items.map((item) => {
        return {
          id: item.id,
          item_name: item.price.name,
          item_art: item.price.art,
          price: item.price.price_dealer,
          qty: item.qty,
          note: item.note,
          date_out: new Date(item.order.date_out),
          order_id: item.order_id,
          customer_id: item.order.customer_id,
          customer_name: item.order.customer.name,
          city: item.order.city,
          suppler_id: item.price.supplier.id,
          suppler_name: item.price.supplier.name,
        };
      });
      setRows(preparedRows);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleSubmit = () => {
    console.log("submit");
  };

  return (
    <>
      <h4>Нужно заказать позиции:</h4>
      {Boolean(rows.length) && (
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} rowHeight={32} />
        </div>
      )}

      <Box flexGrow={1}>
        <Button onClick={handleSubmit} color="primary">
          Отмена
        </Button>
      </Box>
      <FileExportToXls data={rows} name={"Заказать"} />
    </>
  );
};

export default UnorderedPositions;
