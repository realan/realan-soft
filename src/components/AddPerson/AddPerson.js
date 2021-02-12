import React, { useState } from "react";
import { FioSuggestions } from "react-dadata";
import ReactDadataBox from 'react-dadata-box';
import "react-dadata/dist/react-dadata.css";
import { DADATA_API_KEY } from "constants/dadata";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
// import AddAddress from "components/AddAddress/AddAddress";


const AddPerson = ({ onChange }) => {

    const initialState = {
        full_name: "",
        name: "",
        email: "",
        phone: "",
        gender: "",
        birthday: "",
        shopId: "",
        firmId: "",
        customerId: "",
      };

    const [open, setOpen] = useState(false);
    const [state, setState] = useState(initialState);

    const handleChange = (value, type) => {
        const newData = state;
        switch (type) {
            case "full_name":
                newData.full_name    = value.value;
                newData.name         = value.data.name;
                newData.surname      = value.data.surname;
                newData.gender       = value.data.gender;
                break;
            case "name":
                newData.name = value;
                break;
            case "phone":
                newData.phone = value;
                break;
            case "birthday":
                newData.birthday = value;
                break;
            case "email":
                newData.email   = value.value;
                break;
            case "shopId":
                newData.shopId = value;
                break;
            case "firmId":
                newData.firmId = value;
                break;
            case "customerId":
                newData.customerId = value;
                break;
            default: 
                break;
        };
        setState(newData);
      }

    const handleClick = () => { setOpen(!open) };

    const handleAdd = () => { 
        if (state.name !== "") {
            onChange(state, "persons");
            setState(initialState);
        }
        setOpen(!open);
    };

    return (
        <>
            <Button variant="outlined" color="primary" onClick={handleClick}>+ контакт</Button>
            { open && (
                <div>
                    <FioSuggestions token={DADATA_API_KEY} onChange={(suggestion) => handleChange(suggestion, "full_name")} />
                        Как обращаться в письмах
                    <TextField variant="outlined" type="text" size="small" label="Имя" fullWidth 
                        value={state.name}
                        onChange={(event) => handleChange(event.target.value, "name")}
                    />
                        Телефон
                    <TextField variant="outlined" type="text" size="small" label="Номер телефона" fullWidth 
                        defaultValue={initialState.name}
                        onChange={(event) => handleChange(event.target.value, "phone")}
                    />
                        email
                    <ReactDadataBox token={DADATA_API_KEY}  type="email" onChange={(suggestion) => handleChange(suggestion, "email")}/>
                    <Button variant="contained" color="primary" onClick={handleAdd}>Добавить контакт</Button>
                </div>
            )}
        </>
    )
}

export default AddPerson;
