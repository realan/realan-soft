import React from "react";
import { useState, useMemo, useEffect } from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import Pagination from "@material-ui/lab/Pagination";
import PropTypes from "prop-types";
import FileExportToXls from "components/FileExportToXls/FileExportToXls";
import UpdateOrder from "components/OrderData/UpdateOrder";
import OrderDocsButtons from "components/OrderButtonsGroup/OrderDocsButtons";

function CustomPagination(props) {
  const { pagination, api } = props;
  const classes = useStyles();

  return (
    <Pagination
      className={classes.root}
      boundaryCount={50}
      size="large"
      siblingCount={3}
      color="primary"
      page={pagination.page}
      count={pagination.pageCount}
      onChange={(event, value) => api.current.setPage(value)}
    />
  );
}

CustomPagination.propTypes = {
  api: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    paginationMode: PropTypes.oneOf(["client", "server"]).isRequired,
    rowCount: PropTypes.number.isRequired,
  }).isRequired,
};

const useStyles = makeStyles({
  root: {
    display: "flex",
  },
});

const SUBSCRIPTION_ORDERS = gql`
  subscription {
    orders(where: { id: { _gt: 10 } }) {
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

// const GET_ORDER_DATA = gql`
//   query GetOrderData($item_id: Int!) {
//     orders(where: { id: { _eq: $item_id } }) {
//       firm {
//         id
//         name
//         inn
//         kpp
//         okpo
//         address
//         address_mail
//         account
//         management_name
//         management_post
//       }
//       firmByOurFirmId {
//         id
//         ogrn
//         name
//         address
//         address_mail
//         account
//         bank
//         bic
//         inn
//         kpp
//         management_name
//         accountant_name
//         management_post
//       }
//       items {
//         qty
//         price {
//           id
//           art
//           name
//           price_dealer
//           price_opt
//           price_retail
//         }
//       }
//       city
//       bill_id
//       invoice_id
//       discount
//     }
//   }
// `;

const OrdersTable = () => {
  const [rows, setRows] = useState([]);
  const [update, setUpdate] = useState({
    open: false,
    orderId: undefined,
  });

  const columns = useMemo(
    () => [
      { field: "id", headerName: "id", width: 10 },
      { field: "customer", headerName: "Заказчик", width: 200 },
      { field: "shopCity", headerName: "Город", width: 120 },
      { field: "dateOut", headerName: "Отгрузка", type: "date", width: 110 },
      { field: "buttonsDocs", headerName: "Docs", width: 200, renderCell: DocsButtons },
      // { field: "updateOrder", headerName: "Обн", width: 50, renderCell: UpdateOrderIcon },
      { field: "sum", headerName: "Сумма", type: "number", width: 80 },
      { field: "price_type_id", headerName: "Сумма", type: "number", width: 80 },
      // { field: "discount", headerName: "Скидка", type: "number", width: 80 },
      // { field: "payment_status", headerName: "Оплата",  width: 80  },
      { field: "our_firm_id", headerName: "F", width: 70 },
      // { field: "bill_id", headerName: "S", width: 60  },
      // { field: "invoice_id", headerName: "I", width: 50  },
      { field: "statusFirm", headerName: "F", width: 50 },
      { field: "statusShop", headerName: "S", width: 50 },
      { field: "statusPerson", headerName: "P", width: 50 },
    ],
    []
  );

  // const [getOrderData, { loadingOrder, dataOrder }] = useLazyQuery(GET_ORDER_DATA);

  const { loading, error, data } = useSubscription(SUBSCRIPTION_ORDERS);

  useEffect(() => {
    if (!loading && data) {
      const preparedRows = data.orders.map((item) => {
        const dateOut = new Date(item.date_out);
        // console.log(item)
        let city = "";
        item.shop !== null ? (city = item.shop.city) : (city = "");
        const status = {};
        item.shop !== null ? (status.shop = "+") : (status.shop = "-");
        item.firm !== null ? (status.firm = "+") : (status.firm = "-");
        item.person !== null ? (status.person = "+") : (status.person = "-");
        item.bill_id !== null ? (status.bill_id = "+") : (status.bill_id = "-");
        item.invoice_id !== null ? (status.invoice_id = "+") : (status.invoice_id = "-");

        return {
          id: item.id,
          customer: item.customer.name,
          shopCity: city,
          dateOut: dateOut,
          statusShop: status.shop,
          statusFirm: status.firm,
          statusPerson: status.person,
          bill_id: item.bill_id,
          invoice_id: item.invoice_id,
          price_type_id: item.price_type_id,
          discount: item.discount,
          city: item.city,
          payment_status: item.payment_status,
          our_firm_id: item.our_firm_id,
          sum: item.sum,
        };
      });
      console.log(preparedRows);
      setRows(preparedRows);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const onRowClick = (row) => {
    console.log(row.row.id);
    setUpdate({
      open: true,
      orderId: row.row.id,
    });
  };

  function DocsButtons(params) {
    return <OrderDocsButtons params={params} />;
  }

  const handleClose = () => {
    setUpdate({ ...update, open: false });
  };

  return (
    <>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={30}
          onRowClick={onRowClick}
          pagination
          pageSize={40}
          components={{ pagination: CustomPagination }}
        />
      </div>
      <FileExportToXls data={rows} name={"Заказчики"} />
      {update.open && (
        <UpdateOrder open={update.open} onClose={handleClose} orderId={update.orderId} />
      )}
    </>
  );
};

export default OrdersTable;
