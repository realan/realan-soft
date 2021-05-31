import React from "react";
import { useState, useMemo, useEffect } from "react";
// import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import Pagination from "@material-ui/lab/Pagination";
import PropTypes from "prop-types";
import FileExportToXls from "components/FileExportToXls/FileExportToXls";
import { SUBSCRIPTION_CUSTOMERS } from "GraphQL/Subscriptions";

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

// const SUBSCRIPTION_CUSTOMERS = gql`
//     subscription {
//         customers(where: {id: {_gt: 10}}) {
//             id
//             name
//             dealer
//             firms {
//                 id
//                 name
//             }
//             shops {
//                 id
//                 city
//                 name
//             }
//             persons {
//                 id
//                 full_name
//                 phone
//                 email
//                 firm_id
//                 shop_id
//             }
//         }
//     }
// `;

const CustomersTable = () => {
  const [rows, setRows] = useState([]);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "id", width: 10 },
      { field: "name", headerName: "Заказчик", width: 380 },
      { field: "dealer", headerName: "Дилер", width: 150 },
      { field: "saldo", headerName: "Дебиторка", type: "number", width: 80 },
    ],
    []
  );

  const { loading, error, data } = useSubscription(SUBSCRIPTION_CUSTOMERS);

  useEffect(() => {
    if (!loading && data) {
      setRows(data.customers);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={30}
          // onRowClick={onRowClick}
          pagination
          pageSize={40}
          components={{ pagination: CustomPagination }}
        />
      </div>
      <FileExportToXls data={rows} name={"Заказчики"} />
    </>
  );
};

export default CustomersTable;
