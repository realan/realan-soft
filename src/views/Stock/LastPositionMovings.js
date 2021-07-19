import React, { useState, useEffect, useMemo } from "react";
import { gql } from "apollo-boost";
import { DataGrid } from "@material-ui/data-grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { GET_PRICE } from "../../GraphQL/Queries";
// import { ADD_ITEM } from "../../GraphQL/Mutations";
import { useLazyQuery } from "@apollo/react-hooks";
import Autocomplete from "@material-ui/lab/Autocomplete";

const GET_MOVES = gql`
  query GetMoves($item_id: Int!) {
    moving(where: { item_id: { _eq: $item_id } }, limit: 100, order_by: { id: desc }) {
      id
      item_id
      qty
      created_at
      note
      price {
        art
        name
      }
      fromOrder {
        customer {
          id
          name
        }
      }
      toOrder {
        customer {
          id
          name
        }
      }
    }
  }
`;

const LastPositionMovings = () => {
  const rowHeight = 35;
  const rowsQty = 50;
  const [isOpen, setIsOpen] = useState(false);
  const [itemId, setItemId] = useState(undefined);
  const [options, setOptions] = useState([]);
  const [rows, setRows] = useState([]);

  const [getPrice, { loading, error, data }] = useLazyQuery(GET_PRICE);
  const [getMoves, { loading: loadMove, error: errorMove, data: dataMove }] = useLazyQuery(
    GET_MOVES,
    {
      variables: { item_id: itemId },
    }
  );

  useEffect(() => {
    if (!loading && data) {
      setOptions(data.price);
    }
  }, [loading, data]);

  useEffect(() => {
    if (!loadMove && dataMove) {
      console.log(dataMove);

      let preparedData = dataMove.moving.map((it) => {
        return {
          id: it.id,
          item_id: it.item_id,
          note: it.note,
          qty: it.qty,
          created_at: it.created_at,
          art: it.price.art,
          name: it.price.name,
          from: it.fromOrder.customer.name,
          to: it.toOrder.customer.name,
        };
      });
      console.log(preparedData);
      setRows(preparedData);
    }
  }, [loadMove, dataMove]);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "id", width: 80, hide: true },
      // { field: "name", headerName: "Название", width: 250 },
      { field: "qty", headerName: "Заказано", type: "number", width: 110 },
      { field: "note", headerName: "Примечание", width: 150 },
      { field: "from", headerName: "Из", width: 150 },
      { field: "to", headerName: "В", width: 150 },
      { field: "created_at", headerName: "Время", width: 150 },
    ],
    []
  );

  if (loading) return "Loading .....";
  if (error) return `Error! ${error.message}`;
  if (loadMove) return "Loading .....";
  if (errorMove) return `Error! ${errorMove.message}`;

  // const handleChange = (type) => (event) => {
  //   let val = event.target.value;
  //   type === "qty" ? (val = Number(val)) : val;
  //   setState({ ...state, [type]: val });
  // };

  const getInput = (event, val) => {
    if (val !== null) {
      setItemId(val.id);
      getMoves();
    }
  };

  const handleOpen = () => {
    getPrice();
    setIsOpen(true);
  };
  const handleClose = () => {
    // setState(initialState);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        aria-label="редактировать"
        component="span"
        onClick={handleOpen}
      >
        Последние перемещения
      </Button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="add-item-title"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="add-item-title">
          <strong>{Boolean(rows.length) && rows[0].name}</strong> - информация о последних
          перемещениях
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            id="price-combo-box"
            // open={true}
            options={options.sort((a, b) => -b.name.localeCompare(a.name))}
            // groupBy={(option) => option.town}
            getOptionLabel={(option) => option.name}
            onChange={getInput}
            renderInput={(params) => <TextField {...params} label="Название" fullWidth required />}
          />
          {Boolean(rows.length) && (
            <div style={{ height: rowHeight * rowsQty + 200, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                rowHeight={rowHeight}
                //onRowClick={onRowClick}
                pagination
                pageSize={rowsQty}
                // components={{ pagination: CustomPagination }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LastPositionMovings;
