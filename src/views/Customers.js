import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import "react-dadata/dist/react-dadata.css";
import AddFirm from "components/AddFirm/AddFirm";
import ShopDataView from "components/ShopDataView/ShopDataView";
import FirmDataView from "components/FirmDataView/FirmDataView";
import AddShop from "components/AddShop/AddShop";


const Customers = () => {

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

  return (
    <div>
      <h4>Заказчик</h4>
      <TextField variant="outlined" type="text" size="small" label="Заказчик" fullWidth />
      <h4>Фирмы заказчика</h4>
      {listFirms}
      <AddFirm onChange={handleAdd}/>
      <h4>Магазины заказчика</h4>
      {listShops}
      <AddShop onChange={handleAdd}/>
    </div>
  );
};

export default Customers;


  // const [shops, setShops] = useState([])
  // const [persons, setPersons] = useState([])

  // const [valueParty, setValueParty] = useState();
  // const [valueAddress, setValueAddress] = useState();
  // const [address, setAddress] = useState({
  //   full: "",
  //   city: "",
  //   postal_code: "",
  // });
  // const [firm, setFirm] = useState({});
  // const [bank, setBank] = useState({  });
  // const [valueFio, setValueFio] = useState();
  // const API_KEY = DADATA_API_KEY;


  // const handleAddress = (suggestion) => {
  //   setAddress({
  //     full: suggestion.unrestricted_value,
  //     city: suggestion.data.city,
  //     postal_code: suggestion.data.postal_code,
  //   })
  // }

  // const handleFirm = (suggestion) => {
  //   setFirm({

  //     // full: suggestion.unrestricted_value,
  //     // city: suggestion.data.city,
  //     // postal_code: suggestion.data.postal_code,
  //   })
  // }


        {/* Организации заказчика
      <PartySuggestions token={API_KEY} value={valueParty} onChange={(suggestion) => handleFirm(suggestion)} />
      Адрес организации
      <AddressSuggestions token={API_KEY} value={valueAddress} onChange={(suggestion) => handleAddress(suggestion)} />
      <div> {address.full} </div>
      Банковские данные организации
      <ReactDadataBox token={API_KEY}  type="bank" onChange={ (suggestion) => console.log(suggestion)} />
      <div>{bank.full}</div>
      Номер счета
      <TextField variant="outlined" type="number" size="small" label="Номер счета" fullWidth />
      email организации
      <ReactDadataBox token={API_KEY}  type="email" onChange={ (suggestion) => console.log(suggestion)}/>
      Контактные лицо
      <FioSuggestions token={API_KEY} value={valueParty} onChange={(suggestion) => console.log(suggestion)} />
      Телефон
      Email */}