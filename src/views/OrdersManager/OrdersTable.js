import React from "react";
import { useState, useMemo, useEffect } from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
// import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
// import Pagination from "@material-ui/lab/Pagination";
// import PropTypes from "prop-types";
import FileExportToXls from "components/FileExportToXls/FileExportToXls";
// import UpdateOrder from "components/OrderData/UpdateOrder";
import OrderDocsButtons from "./OrderButtonsGroup/OrderDocsButtons";
import EditOrderButton from "./OrderButtonsGroup/EditOrderButton";
import OrderInfoButtons from "./OrderButtonsGroup/OrderInfoButtons";
import { renderProgress } from "@material-ui/x-grid-data-generator";
import DeleteOrderButton from "./OrderButtonsGroup/DeleteOrderButton";
// import EditOrderButton from "./OrderButtonsGroup/EditOrderButton";

const SUBSCRIPTION_ORDERS_MANAGER = gql`
  subscription {
    orders(
      order_by: { id: desc }
      where: { is_cancelled: { _eq: false }, is_shipped: { _eq: false }, id: { _gte: 10 } }
    ) {
      id
      date_out
      sum
      price_type_id
      payment_status
      our_firm_id
      bill_id
      invoice_id
      discount
      city
      note_order
      delivery_id
      weight
      items_aggregate {
        aggregate {
          sum {
            qty
          }
        }
      }
      movingsToOrder_aggregate {
        aggregate {
          sum {
            qty
          }
        }
      }
      movingsFromOrder_aggregate {
        aggregate {
          sum {
            qty
          }
        }
      }
      customer {
        id
        name
      }
      firm {
        id
        name
      }
      shop {
        id
        city
        name
      }
      person {
        id
        full_name
        name
        firm_id
        shop_id
        email
        phone
        passport
      }
    }
  }
`;

const OrdersTable = () => {
  const [rows, setRows] = useState([]);
  const rowHeight = 40;

  const columns = useMemo(
    () => [
      { field: "editOrder", headerName: "Ред", width: 60, renderCell: EditButton },
      { field: "id", headerName: "id", width: 80 },
      { field: "customer", headerName: "Заказчик", width: 200 },
      { field: "shopCity", headerName: "Город", width: 120 },
      { field: "dateOut", headerName: "Отгрузка", type: "date", width: 110 },
      { field: "buttonsInfo", headerName: "Инфо", width: 200, renderCell: InfoButtons },
      { field: "buttonsDocs", headerName: "Документы", width: 150, renderCell: DocsButtons },
      // { field: "updateOrder", headerName: "Обн", width: 50, renderCell: UpdateOrderIcon },
      { field: "sum", headerName: "Сумма", type: "number", width: 120 },
      // { field: "price_type_id", headerName: "Сумма", type: "number", width: 120 },
      { field: "discount", headerName: "Скидка", type: "number", width: 120 },
      { field: "weight", headerName: "Масса", width: 120 },
      { field: "qtyRatio", headerName: "Набрано", renderCell: renderProgress, width: 100 },
      { field: "deleteOrder", headerName: "Удалить", width: 100, renderCell: DeleteButton },
    ],
    []
  );

  const { loading, error, data } = useSubscription(SUBSCRIPTION_ORDERS_MANAGER);

  useEffect(() => {
    if (!loading && data) {
      // console.log("orders", data.orders);
      const preparedRows = data.orders.map((item) => {
        const dateOut = new Date(item.date_out);
        let city = "";
        item.shop !== null ? (city = item.shop.city) : (city = "");
        let qty = item.items_aggregate.aggregate.sum.qty;
        let qtyRatio = +(
          (item.movingsToOrder_aggregate.aggregate.sum.qty -
            item.movingsFromOrder_aggregate.aggregate.sum.qty) /
          qty
        ).toFixed(3);
        return {
          ...item,
          customer: item.customer.name,
          customerId: item.customer.id,
          shopCity: city,
          dateOut: dateOut,
          qtyRatio,
        };
      });
      // console.log("ordersRows", preparedRows);
      setRows(preparedRows);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  function DocsButtons(params) {
    return <OrderDocsButtons params={params} />;
  }
  function InfoButtons(params) {
    return <OrderInfoButtons params={params} />;
  }
  function EditButton(params) {
    return <EditOrderButton params={params} />;
  }
  function DeleteButton(params) {
    return <DeleteOrderButton params={params} />;
  }

  return (
    <>
      <div style={{ height: rowHeight * rows.length + 200, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          //onRowClick={onRowClick}
          // pagination
          // autoPageSize={true}
          // autoHeight={true}
          // pageSize={rows.length}
          //components={{ pagination: CustomPagination }}
        />
      </div>
      <FileExportToXls data={rows} name={"Заказы"} />
    </>
  );
};

export default OrdersTable;
