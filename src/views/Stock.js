import React  from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import ReactTableExp from "../components/ReactTableExp/ReactTableExp";
import DialogDistributePos from "../components/DialogDistributePos/DialogDistributePos";

const GET_STOCK = gql`
  query {
    mr_pivot {
      item_id
      item_name
      stock_now
      order_this_week
      collected_this_week
      order_next_week
      collected_next_week
      order_next
    }
  }
`;




const Stock = () => {

  const columns = React.useMemo(
    () => [
      {Header: "id", accessor: "item_id", type: "integer", show: false, required: true},
      {Header: "Название", accessor: "item_name", type: "text", show: true, required: true},
      {Header: "На складе", accessor: "stock_now", type: "integer", show: true, required: true},
      {Header: "Эта неделя", columns: [  
        {Header: "Заказано", accessor: "order_this_week", type: "integer", show: true, required: true},
        {Header: "Набрано", accessor: "collected_this_week", type: "integer", show: true, required: true},
      ]}, 
      {Header: "Следующая неделя", columns: [  
        {Header: "Заказано", accessor: "order_next_week", type: "integer", show: true, required: true},
        {Header: "Набрано", accessor: "collected_next_week", type: "integer", show: true, required: true},
      ]},
      {Header: "Заказ позже", accessor: "order_next", type: "integer", show: true, required: true},
    ],
    []
  );
  
  const { loading, error, data } = useQuery(GET_STOCK);
  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;


  // function onRowClick (row){
  //   <DialogDistributePos/>
  // }

  const onRowClick = <DialogDistributePos open={true} />


  const dataTable = data.mr_pivot;
  console.log(dataTable)
  
  return (
    <div>
      <h3>Сейчас на складе</h3>
      <ReactTableExp
        columns={columns}
        data={dataTable}
        onRowClick={onRowClick}
      />
    </div>
  )
}

export default Stock;
