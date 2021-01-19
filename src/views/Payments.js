import * as React from "react";
import { DataGrid } from "@material-ui/data-grid";
import InputGroup from "../components/InputGroup/InputGroup";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const SUBSCRIPTION_ITEMS_IN_ORDER = gql`
  subscription SubscriptionsItemsInOrder($order_id: Int!) {
    mr_items(order_by: { item: asc }, where: { mr_order: { id: { _eq: $order_id } } }) {
      id
      item
      qty
      note
      mr_price {
        id
        name
        qty_to: mr_movings_aggregate(where: { to_order: { _eq: $order_id } }) {
          aggregate {
            sum {
              qty
            }
          }
        }
        qty_from: mr_movings_aggregate(where: { from_order: { _eq: $order_id } }) {
          aggregate {
            sum {
              qty
            }
          }
        }
      }
    }
  }
`;

const Payments = () => {

  const [rows, setRows] = React.useState([])

  const { loading, error, data } = useSubscription(SUBSCRIPTION_ITEMS_IN_ORDER, {
    variables: { order_id: 99 },
  });


  
  const onQtyChange = React.useCallback (() => {
    console.log("onQtyChange")
  });

  
  const fromStockField  = React.useCallback(  (params) => {
    return (
      <strong>
        <InputGroup
          maxValue = {1000} //params.row.needQty}
          type = {"stock"}
          id = {params.rowIndex}
          onChange = {onQtyChange}
          params={params}
        />
      </strong>
    )
  }, [onQtyChange] )

  
  const columns = React.useMemo ( () => [
    { field: "id", headerName: "id", width: 30 },
    { field: "name", headerName: "Наименование", type: "text", width: 200 },
    { field: 'fromStock', headerName: 'Со склада', width: 250, renderCell: fromStockField },
  ], [fromStockField]);
  
  React.useEffect(() => {
    if (!loading && data) {
      console.log(data)
      const preparedRows = data.mr_items.map((it, key) => {
        let qtyCollect =
          it.mr_price.qty_to.aggregate.sum.qty - it.mr_price.qty_from.aggregate.sum.qty;
 
        let obj = {
          id: key, // it.id,
          name: it.mr_price.name,
          qtyOrder: it.qty,
          qtyCollect: qtyCollect,
          fromProd: 0, //it.qty,
          fromStock: 0, // it.qty,
          note: it.note,
          to_order: 99,
          idItem: it.mr_price.id,
        };

        return obj;
      });

      console.log(preparedRows)
      setRows(preparedRows);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;





  return (
      <div style={{ height: 800, width: "100%" }}>
        <DataGrid 
          columns={columns} 
          rows={rows} 
          rowHeight={32} 
        />
      </div>
  );
};

export default React.memo(Payments);
