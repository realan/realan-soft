import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { TextField } from "@material-ui/core";
import "react-dadata/dist/react-dadata.css";
import AddFirm from "components/AddFirm/AddFirm";
import ShopDataView from "components/ShopDataView/ShopDataView";
import FirmDataView from "components/FirmDataView/FirmDataView";
import AddShop from "components/AddShop/AddShop";
import PersonDataView from "components/PersonDataView/PersonDataView";
import AddPerson from "components/AddPerson/AddPerson";


const AddCustomer = () => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    firms:[],
    shops:[],
    persons:[],
  });

  const handleAdd = (newData, type) => {
    const obj = {...state};
    const arr = [...state[type], newData];
    obj[type] = arr;
    setState(obj);
  }

  const listFirms = state.firms.map( (item, index) => 
    <div key={index}>
      <FirmDataView value={item} />
    </div>
  )
  const listShops = state.shops.map( (item, index) => 
    <div key={index}>
      <ShopDataView value={item} />
    </div>
  )
  const listPersons = state.persons.map( (item, index) => 
    <div key={index}>
      <PersonDataView value={item} firms={state.firms} shops={state.shops} />
    </div>
  )

  const handleAddCustomer = () => {
      // add customer, return customerId
      // add firms, return firmsId
      // add shops, return shopsId
      // add persons

  }

  return (
    <>
    <Button 
        color="primary" 
        variant="outlined"
        onClick={() => setOpen(true)}>
        Новый заказчик
    </Button>
    <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        aria-labelledby="dialog-title-add-customer"
      >
        <DialogTitle id="draggable-dialog-title"></DialogTitle>

        <DialogContent>
            <h4>Заказчик</h4>
            <TextField variant="outlined" type="text" size="small" label="Заказчик" fullWidth />
            <h4>Фирмы заказчика</h4>
            {listFirms}
            <AddFirm onChange={handleAdd} />
            <h4>Магазины заказчика</h4>
            {listShops}
            <AddShop onChange={handleAdd} />
            <h4>Контактные лица</h4>
            {listPersons}
            <AddPerson onChange={handleAdd} />
        </DialogContent>

        <DialogActions>
          <Box flexGrow={1}>
            <Button onClick={() => setOpen(false)} color="secondary" variant="outlined">
              Отмена
            </Button>
          </Box>
          <Button onClick={handleAddCustomer} color="primary" variant="outlined">
            Добавить заказчика
          </Button>
        </DialogActions>
      </Dialog>  


    </>
  );
};

export default AddCustomer;
