import React from "react";
import { useState, useMemo, useEffect } from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import Pagination from "@material-ui/lab/Pagination";
import PropTypes from "prop-types";
import FileExportToXls from "components/FileExportToXls/FileExportToXls";
// import LensIcon from '@material-ui/icons/Lens';

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
    /**
     * ApiRef that let you manipulate the grid.
     */
    api: PropTypes.shape({
      current: PropTypes.object.isRequired,
    }).isRequired,
    /**
     * The object containing all pagination details in [[PaginationState]].
     */
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
    orders {
      id
      date_out
      sum
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

    const columns = useMemo(
        () => [
          { field: "id", headerName: "id", width: 10 },
          { field: "customer", headerName: "Заказчик", width: 200 },
          { field: "shopCity", headerName: "Город", width: 120 },
          { field: "dateOut", headerName: "Отгрузка", type: "date", width: 110 },
          { field: "sum", headerName: "Сумма", type: "number", width: 80 },
          { field: "statusFirm", headerName: "F", width: 40 },
          { field: "statusShop", headerName: "S", width: 40 },
          { field: "statusPerson", headerName: "P", width: 40 },

        ], []
      );

    const { loading, error, data } = useSubscription(SUBSCRIPTION_ORDERS);

    useEffect(() => {
      if (!loading && data) {
        const preparedRows = data.orders.map(item => {
          const dateOut = new Date(item.date_out);
          // console.log(item)
          let city = "";
          item.shop !== null ? city = item.shop.city: city = "";
          const status = {};
          item.shop   !== null ? status.shop = "+"    : status.shop = "-";
          item.firm   !== null ? status.firm = "+"    : status.firm = "-";
          item.person !== null ? status.person = "+"  : status.person = "-";

          return {
            id: item.id,
            customer: item.customer.name,
            shopCity: city,
            dateOut: dateOut,
            statusShop: status.shop,
            statusFirm: status.firm,
            statusPerson: status.person,
          }
        }) 
        setRows(preparedRows);
      }
    }, [loading, data]);

    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;

    const onRowClick = (row) => {
      console.log(row);
      // setItemForDialog({
      //   orderData: row.row,
      //   isOpen: true,
      // });
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
            <FileExportToXls  data={rows} name={"Заказчики"} />
      </>
      );

}

export default OrdersTable;