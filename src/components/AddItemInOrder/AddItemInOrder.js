import React, { useState, useEffect } from "react";
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

const AddItemInOrder = ({ onSubmit }) => {
  const initialState = {
    qty: 0,
    note: "",
    name: "",
    art: "",
    price_dealer: 0,
    price_opt: 0,
    price_retail: 0,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(initialState);
  const [options, setOptions] = useState([]);
  // const [AddItems] = useMutation(ADD_ITEM);

  const [getPrice, { loading, error, data }] = useLazyQuery(GET_PRICE);

  useEffect(() => {
    if (!loading && data) {
      setOptions(data.price);
    }
  }, [loading, data]);

  if (loading) return "Loading .....";
  if (error) return `Error! ${error.message}`;

  const handleChange = (type) => (event) => {
    let val = event.target.value;
    type === "qty" ? (val = Number(val)) : val;
    setState({ ...state, [type]: val });
  };

  const getInput = (event, val) => {
    if (val !== null) {
      let obj = {
        ...state,
        id: 1000,
        name: val.name,
        art: val.art,
        qty: 0,
        item_id: val.id,
        price_dealer: val.price_dealer,
        price_opt: val.price_opt,
        price_retail: val.price_retail,
        weight: val.weight,
      };
      setState(obj);
    }
  };

  const handleOpen = () => {
    getPrice();
    setIsOpen(true);
  };
  const handleClose = () => {
    setState(initialState);
    setIsOpen(false);
  };

  const handleOk = () => {
    // console.log(state)
    if (state.qty !== 0) {
      console.log(state);
      onSubmit(state);
      // const addData = {
      //   // order: orderId,
      //   item_id: state.item_id,
      //   qty: Number(state.qty),
      //   note: state.note,
      // };
      // console.log(addData);
      // AddItems({ variables: { addData: addData } });
    }
    setState(initialState);
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
        Добавить позицию
      </Button>

      <Dialog open={isOpen} onClose={handleClose} aria-labelledby="add-item-title" maxWidth="sm">
        <DialogTitle id="add-item-title">Добавляем позицию в заказ</DialogTitle>
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
          <TextField
            margin="dense"
            label="Кол-во"
            type="number"
            fullWidth
            value={state.qty}
            onChange={handleChange("qty")}
          />
          <TextField
            margin="dense"
            label="Примечание"
            type="text"
            fullWidth
            value={state.note}
            onChange={handleChange("note")}
          />
          <TextField
            margin="dense"
            label="Цена опт"
            type="number"
            fullWidth
            value={state.price_opt}
            onChange={handleChange("price_opt")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleOk} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddItemInOrder;
