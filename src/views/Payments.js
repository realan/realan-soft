import * as React from "react";
import { XGrid } from "@material-ui/x-grid";
import { useDemoData } from "@material-ui/x-grid-data-generator";



const Payments = () => {

  const { data } = useDemoData({
    dataSet: "Commodity",
    rowLength: 10
  });

  const onRowClick = (row) => {
    alert(row);
  };

  console.log(data);

  return (
    <div style={{ height: 520, width: "100%" }}>
      <XGrid
        
        loading={data.rows.length === 0}
        pagination={true}
        pageSize={5}
        rowHeight={38}
        checkboxSelection
        onRowClick={onRowClick}
        {...data}
      />
    </div>
  )
}

export default Payments;
