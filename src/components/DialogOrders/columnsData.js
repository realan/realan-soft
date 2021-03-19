import React from "react";
import Close from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { QuantityChanger } from "components/QuantityChanger";

const posUpdate = (params) => {
  setDataRow(params.row);
  setOpenUpdate(true);
};

const STORE_TYPE = {
  PRODUCTION: "production",
  STOCK: "stock",
};

const onePosDelete = (data) => {
  DeteteItemMutation({ variables: { id: data.id } });
  let qty = data.qtyCollect;
  if (qty !== 0) {
    const addData = {
      qty: qty,
      to_order: 3, // id = 3 - склад
      from_order: orderId,
      item: data.qtyCollect,
    };
    AddMoveItemMutation({ variables: { addData: addData } });
  }
};

const posDelete = (params) => {
  onePosDelete(params.row);
};

function updateField(params) {
  return (
    <strong>
      <IconButton
        color="primary"
        aria-label="редактировать"
        component="span"
        onClick={() => posUpdate(params)}
      >
        <EditIcon />
      </IconButton>
      <Tooltip title="Удаляю позицию. Что набрано - перемещаю на склад">
        <IconButton
          color="secondary"
          aria-label="редактировать"
          component="span"
          onClick={() => posDelete(params)}
        >
          <Close />
        </IconButton>
      </Tooltip>
    </strong>
  );
}

function fromProdField(params) {
  const needQty = params.row.qtyOrder - params.row.qtyCollect - params.row.fromStock;
  return (
    <strong>
      <QuantityChanger
        maxValue={needQty}
        id={params.rowIndex}
        onChange={(newValue) =>
          onCountChange(newValue, rows, params.rowIndex, STORE_TYPE.PRODUCTION)
        }
        colorType="default"
        value={params.row.fromProd}
      />
    </strong>
  );
}

function fromStockField(params) {
  const needQty = params.row.qtyOrder - params.row.qtyCollect - params.row.fromProd;
  let maxValue = 0;
  needQty < params.row.qtyStock ? (maxValue = needQty) : (maxValue = params.row.qtyStock);
  return (
    <strong>
      <QuantityChanger
        minValue={-params.row.qtyCollect}
        maxValue={maxValue}
        id={params.rowIndex}
        onChange={(newValue) => onCountChange(newValue, rows, params.rowIndex, STORE_TYPE.STOCK)}
        value={params.row.fromStock}
      />
    </strong>
  );
}

const columnsData = [
  { field: "id", headerName: "id", width: 30 },
  { field: "name", headerName: "Наименование", type: "text", width: 280 },
  { field: "qtyOrder", headerName: "Заказ", type: "number", width: 70 },
  { field: "qtyCollect", headerName: "Набрано", type: "number", width: 70 },
  { field: "fromProd", headerName: "С доработки", width: 220, renderCell: fromProdField },
  { field: "qtyStock", headerName: "Склад", type: "number", width: 70 },
  { field: "fromStock", headerName: "Со склада", width: 220, renderCell: fromStockField },
  { field: "note", headerName: "Примечание", type: "text", width: 200 },
  { field: "update", headerName: "обновить", width: 100, renderCell: updateField },
];

export default columnsData;
