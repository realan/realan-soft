import React, { useState, useEffect } from "react";
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
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

const ADD_CUSTOMER = gql`
  mutation AddCustomerMutation($addData: customers_insert_input!) {
    insert_customers(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const ADD_FIRMS = gql`
  mutation AddFirmsMutation($addData: [firms_insert_input!]!) {
    insert_firms(objects: $addData) {
      affected_rows
      returning {
        id
        name
      }
    }
  }
`;

const ADD_SHOPS = gql`
  mutation AddShopsMutation($addData: [shops_insert_input!]!) {
    insert_shops(objects: $addData) {
      affected_rows
      returning {
        id
        name
      }
    }
  }
`;

const ADD_PERSONS = gql`
  mutation AddPersonsMutation($addData: [persons_insert_input!]!) {
    insert_persons(objects: $addData) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const AddCustomer = () => {

  const initialState = {
    firms:[],
    shops:[],
    persons:[],    
  };
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [canInsertPersons, setCanInsertPersons] = useState(false);
  const [state, setState] = useState(initialState);
  
  const [ AddCustomerMutation, { data: addCustomerData, loading: addCustomerLoading, error: addCustomerError },
  ] = useMutation(ADD_CUSTOMER);

  const [ AddFirmsMutation, { data: addFirmsData, loading: addFirmsLoading, error: addFirmsError },
  ] = useMutation(ADD_FIRMS);

  const [ AddShopsMutation, { data: addShopsData, loading: addShopsLoading, error: addShopsError },
  ] = useMutation(ADD_SHOPS);

  const [ AddPersonsMutation, { loading: addPersonsLoading, error: addPersonsError },
  ] = useMutation(ADD_PERSONS);

  useEffect(() => {
    if (!addCustomerLoading && addCustomerData) {
      const customerId = addCustomerData.insert_customers.returning[0].id;

      const firmsData = state.firms.map( item => {
        item.customer_id = customerId;
        return item;
      });
      AddFirmsMutation({ variables: { addData: firmsData } });

      const shopsData = state.shops.map( item => {
        item.customer_id = customerId;
        return item;
      });
      AddShopsMutation({ variables: { addData: shopsData } });

      setCanInsertPersons(true);
    }
  }, [addCustomerLoading, addCustomerData]);

  useEffect(() => {
    if (canInsertPersons && addShopsData && addFirmsData) {
      const customerId = addCustomerData.insert_customers.returning[0].id;

      const personsData = state.persons.map( item => {
        console.log(item)
        console.log(addFirmsData)
        // const firmId;
        if (item.firm_id !== null) {
          item.firm_id = addFirmsData.insert_firms.returning[item.firm_id].id;
        }
        // const shopId;
        if (item.shop_id !== null) {
          item.shop_id = addShopsData.insert_shops.returning[item.shop_id].id;
        }
        // const shopId = addShopsData.insert_shops.returning[item.shop_id].id;
        // item.shop_id = shopId;
        item.customer_id = customerId;
        return item;
      });

      AddPersonsMutation({ variables: { addData: personsData } });
        // console.log(personsData)
        // console.log(addShopsData)
        // console.log(addFirmsData)
    }
  }, [addShopsData, addFirmsData, addCustomerData, canInsertPersons]);

  if (addCustomerLoading) return "Adding Customer....";
  if (addCustomerError) return `Error! ${addCustomerError.message}`;
  if (addFirmsLoading) return "Adding Firm....";
  if (addFirmsError) return `Error! ${addFirmsError.message}`;
  if (addShopsLoading) return "Adding Shop....";
  if (addShopsError) return `Error! ${addShopsError.message}`;
  if (addPersonsLoading) return "Adding Person....";
  if (addPersonsError) return `Error! ${addPersonsError.message}`;

  const handleSubmit = () => {
    // add customer, return customerId
    const addData = {
      name: customer,
    }
    // console.log(addData);
    AddCustomerMutation({ variables: { addData: addData } });
    // add firms, return firmsId, then add shops, return shopsId, then add persons
  }

  const handleChangeData = (newData, type) => {
    const obj = {...state};
    const arr = [...state[type], newData];
    obj[type] = arr;
    setState(obj);
  }

  const handleCancel = () => {
    setOpen(false);
    setState(initialState);
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
      <PersonDataView 
        value={item} 
      />
    </div>
  )

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
        fullWidth={true}
        aria-labelledby="dialog-title-add-customer"
      >
        <DialogTitle id="draggable-dialog-title"></DialogTitle>

        <DialogContent>
            <h4>Заказчик</h4>
            <TextField 
              variant="outlined" type="text" size="small" label="Заказчик" fullWidth 
              value={state.customer}
              onChange={(event) => setCustomer(event.target.value)}
            />
            <h4>Фирмы заказчика</h4>
            {listFirms}
            <AddFirm onChange={handleChangeData} />
            <h4>Магазины заказчика</h4>
            {listShops}
            <AddShop onChange={handleChangeData} />
            <h4>Контактные лица</h4>
            {listPersons}
            <AddPerson 
              onChange={handleChangeData} 
              firms={state.firms} 
              shops={state.shops} 
            />
        </DialogContent>

        <DialogActions>
          <Box flexGrow={1}>
            <Button onClick={handleCancel} color="secondary" variant="outlined">
              Отмена
            </Button>
          </Box>
          <Button onClick={handleSubmit} color="primary" variant="outlined">
            Добавить заказчика
          </Button>
        </DialogActions>
      </Dialog>  


    </>
  );
};

export default AddCustomer;
