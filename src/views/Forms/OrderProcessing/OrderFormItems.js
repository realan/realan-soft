import React from "react";
import { useState, useEffect } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { DataGrid } from "@material-ui/data-grid";
import Grid from "@material-ui/core/Grid";
import GetOrderItems from "./GetOrderItems";
import AddItemInOrder from "./AddItemInOrder";
import EditItemInOrder from "components/EditItemInOrder/EditItemInOrder";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
// import Typography from "@material-ui/core/Typography";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import FormSection from "components/FormSection/FormSection";
import FileExportToXls from "components/FileExportToXls/FileExportToXls";

export const DELETE_ITEM = gql`
  mutation DeleteItem($id: Int!) {
    delete_items_by_pk(id: $id) {
      id
    }
  }
`;

export default function OrderFormItems({ orderData, onChange, type }) {
  const [state, setState] = useState({
    weight: 0,
    sum_in: 0,
    sum_dealer: 0,
    sum_opt: 0,
    sum_retail: 0,
  });

  const [tableHeight, setTableHeight] = useState(200);
  const [openEdit, setOpenEdit] = useState(false);
  const [DeleteItem, { loading, error }] = useMutation(DELETE_ITEM);

  const initStateEditRow = {
    id: undefined,
    qty: undefined,
    note: undefined,
  };

  const [editRow, setEditRow] = useState(initStateEditRow);

  useEffect(() => {
    console.log(orderData);
    if (orderData.items) {
      console.log("orderData", orderData);
      let obj = {
        weight: +orderData.items.reduce((sum, it) => sum + it.qty * it.weight, 0).toFixed(3),
        sum_in: +orderData.items.reduce((sum, it) => sum + it.qty * it.price_in, 0).toFixed(2),
        sum_opt: +orderData.items.reduce((sum, it) => sum + it.qty * it.price_opt, 0).toFixed(2),
        sum_dealer: +orderData.items
          .reduce((sum, it) => sum + it.qty * it.price_dealer, 0)
          .toFixed(2),
        sum_retail: +orderData.items
          .reduce((sum, it) => sum + it.qty * it.price_retail, 0)
          .toFixed(2),
      };
      // console.log(orderData.items);
      // console.log("orderSums", obj);
      setState(obj);
      let rowC = orderData.items.length > 100 ? 100 : orderData.items.length;
      setTableHeight(200 + 32 * rowC);
      onChange("orderParams", obj);
    }
  }, [orderData.items]);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const columns = [
    { field: "id", headerName: "id", width: 70 },
    { field: "name", headerName: "Наименование", type: "text", width: 200 },
    { field: "art", headerName: "Артикул", type: "text", width: 80 },
    { field: "qty", headerName: "К-во", type: "number", width: 80 },
    { field: "price_opt", headerName: "Цена", type: "number", width: 100 },
    { field: "note", headerName: "Примечание", type: "text", width: 200 },
  ];

  const onRowClick = (params) => {
    setEditRow(params.row);
    setOpenEdit(true);
    // console.log(params.row);
  };

  const handleDeleteItem = () => {
    const itemsArr = orderData.items.filter((it) => it.id !== editRow.id);
    onChange("items", itemsArr);
    // if update - delete from DB
    if (type === "update") {
      DeleteItem({ variables: { id: editRow.id } });
    }
    setOpenEdit(false);
  };

  const handleCancelEdit = () => {
    setEditRow(initStateEditRow);
    setOpenEdit(false);
  };

  const handleEditItem = (type, value) => {
    setEditRow({ ...editRow, [type]: value });
  };

  const handleAddItem = (value) => {
    const itemsArr = [...orderData.items]; //.map((it) => it);
    itemsArr.push(value);
    console.log(itemsArr);
    onChange("items", itemsArr);
  };

  const handleSubmitChange = () => {
    const itemsArr = orderData.items.map((it) => (it.id === editRow.id ? editRow : it));
    console.log(itemsArr);
    onChange("items", itemsArr);
    setOpenEdit(false);
  };

  return (
    <FormSection title={"Позиции в заказе"} icon={PeopleAltIcon}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          Масса <strong>{state.weight}</strong>, сумма дилер {state.sum_dealer} руб., сумма опт{" "}
          {state.sum_opt} руб., сумма розн {state.sum_retail} руб.
        </Grid>
        <Box flexGrow={1}>
          {type === "add" && <GetOrderItems onChange={(items) => onChange("items", items)} />}
          <AddItemInOrder onSubmit={handleAddItem} index={orderData.items.length} />
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={orderData.is_need_packing}
              onChange={(event) => onChange("is_need_packing", event.target.checked)}
              name="checkedB"
              color="primary"
            />
          }
          label="Наша упаковка?"
        />
        <FileExportToXls data={orderData.items} name={"Позиции в заказе"} />

        <Grid item xs={12}>
          <div style={{ height: tableHeight, width: "100%" }}>
            <DataGrid
              columns={columns}
              rows={orderData.items}
              //getRowId={(row) => row.art}
              rowHeight={32}
              onRowClick={onRowClick}
            />
          </div>
        </Grid>
      </Grid>
      <EditItemInOrder
        value={editRow}
        onCancel={handleCancelEdit}
        onChange={handleEditItem}
        onDelete={handleDeleteItem}
        onSubmit={handleSubmitChange}
        open={openEdit}
      />
    </FormSection>
  );
}
