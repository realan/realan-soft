import React from "react";
import { useState, useEffect, useMemo } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
// import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
// import FileExportToXls from "components/FileExportToXls/FileExportToXls";

const QUERY_ORDERS = gql`
  query QueryOrders {
    supplier_orders: orders(where: { is_shipped: { _eq: false } }, order_by: { date_out: asc }) {
      id
      customer_id
      sum_in
      date_out
      date_in
      weight
      is_purchase
    }
  }
`;

const OrdersWidget = () => {
  const [rows, setRows] = useState([]);
  const rowHeight = 32;

  const { loading, error, data } = useQuery(QUERY_ORDERS);

  useEffect(() => {
    if (!loading && data) {
      const orders = data.supplier_orders.map((item) => {
        const dateOut = new Date(item.date_out);
        return {
          id: item.id,
          weekNumber: moment(dateOut).isoWeek(),
          weekEnd: new Date(moment(dateOut).endOf("isoWeek")),
          sum: item.sum_in,
          weight: item.weight,
          isSupply: item.is_purchase,
        };
      });
      console.log("orders", orders);
      let prepRows = orders.reduce((prev, cur) => {
        let existing = prev.find((x) => x.weekNumber === cur.weekNumber);

        let sum = cur.sum ? +cur.sum.toFixed(0) : 0;
        let weight = cur.weight ? +cur.weight.toFixed(0) : 0;

        if (existing) {
          if (cur.isSupply) {
            existing.weightIn = existing.weightIn + weight;
            existing.sumIn = existing.sumIn + sum;
          } else {
            existing.weightOut = existing.weightOut + weight;
            existing.sumOut = existing.sumOut + sum;
          }
        } else {
          prev.push({
            id: cur.id,
            weekNumber: cur.weekNumber,
            weekEnd: cur.weekEnd,
            weightIn: cur.isSupply ? weight : 0,
            weightOut: cur.isSupply ? 0 : weight,
            sumOut: cur.isSupply ? 0 : sum,
            sumIn: cur.isSupply ? sum : 0,
          });
        }

        return prev;
      }, []);

      //   const weekMin = ()
      console.log("ordersRows", prepRows);
      setRows(prepRows);
    }
  }, [loading, data]);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "id", width: 80 },
      { field: "weekNumber", headerName: "Неделя", type: "number", width: 100 },
      { field: "weekEnd", headerName: "Конец недели", type: "date", width: 150 },
      { field: "weightIn", headerName: "Масса", type: "number", width: 120 },
      { field: "sumIn", headerName: "Сумма вх", type: "number", width: 150 },
      //   { field: "mramolit", headerName: "От Мрамолита", type: "number", width: 120 },
      //   { field: "toPacking", headerName: "Упаковать", type: "number", vwidth: 120 },
      //   { field: "sumCustOrders", headerName: "Заказчики", type: "number", width: 110 },
    ],
    []
  );

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      {Boolean(rows.length) && (
        <div style={{ height: rowHeight * rows.length + 200, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={rowHeight}
            hideFooterPagination
            hideFooterRowCount
            //onRowClick={onRowClick}
            //   pagination
            // autoPageSize={true}
            // autoHeight={true}
            // pageSize={rows.length}
            //components={{ pagination: CustomPagination }}
          />
        </div>
      )}
    </>
  );
};

export default OrdersWidget;
