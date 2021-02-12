import React, { useState } from "react";
import { PartySuggestions } from "react-dadata";
import { AddressSuggestions } from "react-dadata";
import ReactDadataBox from 'react-dadata-box';
import "react-dadata/dist/react-dadata.css";
import { DADATA_API_KEY } from "constants/dadata";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
// import AddAddress from "components/AddAddress/AddAddress";


const AddFirm = ({ onChange }) => {

    const initialState = {
        name: "",
        address: "",
        addressMail: "",
        managementName: "",
        managementPost: "",
        inn: "",
        kpp: "",
        ogrn: "",
        okpo: "",
        account: "",
        bank: "",
        bic: "",
        corrAccount: "",
        email: "",
      };

    const [open, setOpen] = useState(false);
    const [state, setState] = useState(initialState);

    const handleChange = (value, type) => {
        const newData = state;
        switch (type) {
            case "firm":
                if (value.data.management === null) {
                    newData.managementName = "";
                    newData.managementPost = "";
                } else {
                    newData.managementName = value.data.management.name;
                    newData.managementPost = value.data.management.post; 
                }
                newData.name            = value.value;
                newData.address         = value.data.address.unrestricted_value;
                newData.inn             = value.data.inn;
                newData.kpp             = value.data.kpp;
                newData.ogrn            = value.data.ogrn;
                newData.okpo            = value.data.okpo;
                break;
            case "address":
                newData.addressMail     = value.data.unrestricted_value;
                break;
            case "bank":
                newData.bank            = value.value;
                newData.bic             = value.data.bic;
                newData.corrAccount     = value.data.correspondent_account;
                break;
            case "account":
                newData.account         = value;
                break;
            case "email":
                newData.email           = value.value;
                break;
            default: 
                break;
        };
        setState(newData);
      }

    const handleClick = () => { setOpen(!open) };

    const handleAdd = () => { 
        if (state.name !== "") {
            onChange(state, "firms");
            setState(initialState);
        }
        setOpen(!open);
    };

    return (
        <>

            <Button variant="outlined" color="primary" onClick={handleClick}>+ фирма</Button>
            { open && (
                <div>
                        Поиск по названию или ИНН
                    <PartySuggestions token={DADATA_API_KEY} onChange={(suggestion) => handleChange(suggestion, "firm")} />
                        Почтовый адрес (если отличается от юридического)
                    <AddressSuggestions token={DADATA_API_KEY} onChange={(suggestion) => handleChange(suggestion, "address")} />
                        Банк
                    <ReactDadataBox token={DADATA_API_KEY}  type="bank" onChange={(suggestion) => handleChange(suggestion, "bank")} />
                        Расчетный счет
                    <TextField variant="outlined" type="number" size="small" label="Номер счета" fullWidth 
                        onChange={(event) => handleChange(event.target.value, "account")}
                    />
                        email организации
                    <ReactDadataBox token={DADATA_API_KEY}  type="email" onChange={(suggestion) => handleChange(suggestion, "email")}/>
                    <Button variant="contained" color="primary" onClick={handleAdd}>Добавить фирму</Button>
                </div>
            )}
        </>
    )
}

export default AddFirm;
