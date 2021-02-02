// import StimulsoftViewer from "components/StimulsoftViewer/StimulsoftViewer";
import * as React from "react";

const Payments = () => { 

  return (
    <>
      {/* <StimulsoftViewer /> */}

    </>
  );
};

export default Payments;


 // const [rowsData, setRowsData] = React.useState([])

  // const { loading, error, data } = useSubscription(SUBSCRIPTION_ITEMS_IN_ORDER, {
  //   variables: { order_id: 150 },
  // });
  
  // const columns = React.useMemo ( () => [
  //   { field: "id", headerName: "id", width: 30 },
  //   { field: "name", headerName: "Наименование", type: "text", width: 300 },
  //   { field: "qtyOrder", headerName: "Q-ty", type: "number", width: 100 },
  //   // { field: 'fromStock', headerName: 'Со склада', width: 250, renderCell: fromStockField },
  // ], []);
  
  // React.useEffect(() => {
  //   if (!loading && data) {
  //     const preparedRows = data.mr_items.map((it, key) => {
  //       let obj = {
  //         id: key, // it.id,
  //         name: it.mr_price.name,
  //         qtyOrder: it.qty,
  //         note: it.note,
  //         to_order: 99,
  //         idItem: it.mr_price.id,
  //       };
  //       return obj;
  //     });
  //     setRows(preparedRows);
  //     setRowsData(preparedRows);
  //   }
  // }, [loading, data]);

  // if (loading) return "Loading....";
  // if (error) return `Error! ${error.message}`;

  // const onSearchChange = (text) => {
  //   const preparedRows = rowsData.filter( row => row.name.toLowerCase().indexOf(text) >= 0);
  //   console.log(preparedRows)
  //   setRows(preparedRows);
  // }
