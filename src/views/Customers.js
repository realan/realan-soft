import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import "react-dadata/dist/react-dadata.css";
import AddFirm from "components/AddFirm/AddFirm";
import FirmDataView from "components/FirmDataView/FirmDataView";


const Customers = () => {

  const [firms, setFirms] = useState([]);

  const handleAddFirm = (firms, newFirm) => {
    console.log(firms)
    const newArr = [...firms, newFirm];
    console.log(newArr);
    setFirms(newArr);
  }

  const listFirms = firms.map( (item, index) => 
    <div key={index}>
      <FirmDataView value={item} />
    </div>
  )

  //Boolean(firms.lenght) && 

  return (
    <div>
      <h4>Заказчик</h4>
      <TextField variant="outlined" type="text" size="small" label="Заказчик" fullWidth />
      <h4>Фирмы заказчика</h4>
      {listFirms}
      <AddFirm onChange={handleAddFirm} array={firms}/>
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