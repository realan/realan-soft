import React, { useState } from "react";
import { PartySuggestions } from "react-dadata";
import { AddressSuggestions } from "react-dadata";
import ReactDadataBox from "react-dadata-box";
import "react-dadata/dist/react-dadata.css";
import { DADATA_API_KEY } from "constants/dadata";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
// import AddAddress from "components/AddAddress/AddAddress";

const AddFirm = ({ onChange }) => {
  const initialState = {
    name: "",
    address: "",
    address_mail: "",
    management_name: "",
    management_post: "",
    inn: "",
    kpp: "",
    ogrn: "",
    okpo: "",
    account: "",
    bank: "",
    bic: "",
    corr_account: "",
    email: "",
    site: "",

    //         name - text
    // customer_id - integer, nullable
    // address - text, nullable
    // inn - text, nullable
    // kpp - text, nullable
    // ogrn - text, nullable
    // okpo - text, nullable
    // address_mail - text, nullable
    // email - text, nullable
    // site - text, nullable
    // management_name - text, nullable
    // management_post - text, nullable
    // bank - text, nullable
    // bic - text, nullable
    // account - text, nullable
    // corr_account - text, nullable
  };

  const [open, setOpen] = useState(false);
  const [state, setState] = useState(initialState);

  const handleChange = (value, type) => {
    console.log(value);
    const newData = state;
    switch (type) {
      case "firm":
        // ("unrestricted_value" in value.address) ? console.log(true) : console.log(false);
        newData.name = value.value;
        newData.inn = value.data.inn;
        newData.ogrn = value.data.ogrn;
        newData.okpo = value.data.okpo;
        newData.address = value.data.address.unrestricted_value;
        if (value.data.type === "INDIVIDUAL") {
          newData.management_name = value.data.name.full;
          newData.management_post = "";
          newData.kpp = "";
        } else if (value.data.management === null) {
          newData.management_name = "";
          newData.management_post = "";
          newData.kpp = value.data.kpp;
        } else {
          newData.management_name = value.data.management.name;
          newData.management_post = value.data.management.post;
          newData.kpp = value.data.kpp;
        }
        break;
      case "address":
        newData.address_mail = value.data.unrestricted_value;
        break;
      case "bank":
        newData.bank = value.value;
        newData.bic = value.data.bic;
        newData.corr_account = value.data.correspondent_account;
        break;
      case "account":
        newData.account = value;
        break;
      case "email":
        newData.email = value.value;
        break;
      default:
        break;
    }
    setState(newData);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleAdd = () => {
    if (state.name !== "") {
      onChange(state, "firms");
      setState(initialState);
    }
    setOpen(!open);
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClick}>
        + фирма
      </Button>
      {open && (
        <div>
          Поиск по названию или ИНН
          <PartySuggestions
            token={DADATA_API_KEY}
            onChange={(suggestion) => handleChange(suggestion, "firm")}
          />
          Почтовый адрес (если отличается от юридического)
          <AddressSuggestions
            token={DADATA_API_KEY}
            onChange={(suggestion) => handleChange(suggestion, "address")}
          />
          Банк
          <ReactDadataBox
            token={DADATA_API_KEY}
            type="bank"
            onChange={(suggestion) => handleChange(suggestion, "bank")}
          />
          Расчетный счет
          <TextField
            variant="outlined"
            type="number"
            size="small"
            label="Номер счета"
            fullWidth
            onChange={(event) => handleChange(event.target.value, "account")}
          />
          email организации
          <ReactDadataBox
            token={DADATA_API_KEY}
            type="email"
            onChange={(suggestion) => handleChange(suggestion, "email")}
          />
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Добавить фирму
          </Button>
        </div>
      )}
    </>
  );
};

export default AddFirm;
