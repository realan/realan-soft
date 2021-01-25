import * as React from "react";
import { DataGrid } from "@material-ui/data-grid";
// import InputGroup from "../components/InputGroup/InputGroup";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import VoiceInput from "components/VoiceInput/VoiceInput";

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
  const [rowsData, setRowsData] = React.useState([])

  const { loading, error, data } = useSubscription(SUBSCRIPTION_ITEMS_IN_ORDER, {
    variables: { order_id: 150 },
  });
  
  const columns = React.useMemo ( () => [
    { field: "id", headerName: "id", width: 30 },
    { field: "name", headerName: "Наименование", type: "text", width: 300 },
    { field: "qtyOrder", headerName: "Q-ty", type: "number", width: 100 },
    // { field: 'fromStock', headerName: 'Со склада', width: 250, renderCell: fromStockField },
  ], []);
  
  React.useEffect(() => {
    if (!loading && data) {
      const preparedRows = data.mr_items.map((it, key) => {
        let obj = {
          id: key, // it.id,
          name: it.mr_price.name,
          qtyOrder: it.qty,
          note: it.note,
          to_order: 99,
          idItem: it.mr_price.id,
        };
        return obj;
      });
      setRows(preparedRows);
      setRowsData(preparedRows);
    }
  }, [loading, data]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const onSearchChange = (text) => {
    const preparedRows = rowsData.filter( row => row.name.toLowerCase().indexOf(text) >= 0);
    console.log(preparedRows)
    setRows(preparedRows);
  }



  return (
    <>
      <VoiceInput onChange={onSearchChange} />
      <div style={{ height: 800, width: "100%" }}>
        <DataGrid 
          columns={columns} 
          rows={rows} 
          rowHeight={32} 
        />
      </div>
    </>
  );
};

export default Payments;
