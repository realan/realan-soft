import React  from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import ReactTable from "../components/ReactTable/ReactTable";


const GET_STOCK = gql`
  query {
    mr_stock_now {
      item_id
      item_name
      item_art
      into_stock
      out_stock
    }
  }
`;



const Stock = () => {

  const columns = React.useMemo(
    () => [
      {Header: "id", accessor: "item_id", type: "integer", show: false, required: true},
      {Header: "Название", accessor: "item_name", type: "text", show: true, required: true},
      {Header: "Артикул", accessor: "item_art", type: "text", show: true, required: true},
      // {Header: "Категория", accessor: "category_name", type: "text", show: true, required: true},
      {Header: "Пришло", accessor: "into_stock", type: "integer", show: true, required: true},
      {Header: "Ушло", accessor: "out_stock", type: "integer", show: true, required: true},
    ],
    []
  );
  
  const { loading, error, data } = useQuery(GET_STOCK);
  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const dataTable = data.mr_stock_now;
  
  return (
    <div>
      <h3>Сейчас на складе</h3>
      <ReactTable
        columns={columns}
        data={dataTable}
      />
    </div>
  )
}

export default Stock;
