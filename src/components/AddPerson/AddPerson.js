import React, { useState } from "react";
import { AddressSuggestions } from "react-dadata";
import ReactDadataBox from 'react-dadata-box';
import "react-dadata/dist/react-dadata.css";
import { DADATA_API_KEY } from "constants/dadata";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
// import AddAddress from "components/AddAddress/AddAddress";


const AddPerson = ({ onChange  }) => {

    const initialState = {
        full_name: "",
        name: "",
        email: "",
        phone: "",
        gender: "",
        birthday: "",
        shopId: "",
        firmId: "",
      };

    const [open, setOpen] = useState(false);
    const [state, setState] = useState(initialState);

    const handleChange = (value, type) => {
        const newData = state;
        switch (type) {
            case "full_name":
                newData.full_name    = value;
                newData.name         = value.data.name;
                newData.gender       = value.data.gender;
                break;
            case "phone":
                newData.phone = value;
                break;
            case "birthday":
                newData.dirthday = value;
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
            default: 
                break;
        };
        setState(newData);
      }

    const handleClick = () => { setOpen(!open) };

    const handleAdd = () => { 
        if (state.name !== "") {
            onChange(state, "shops");
            setState(initialState);
        }
        setOpen(!open);
    };

    return (
        <>
            <Button variant="outlined" color="primary" onClick={handleClick}>+ магазин</Button>
            { open && (
                <div>
                    <FioSuggestions token={DADATA_API_KEY} onChange={(suggestion) => handleChange(suggestion, "full_name")} />
                    <TextField variant="outlined" type="text" size="small" label="Название магазина" fullWidth 
                        defaultValue={initialState.name}
                        onChange={(event) => handleChange(event.target.value, "name")}
                    />
                    <TextField variant="outlined" type="text" size="small" label="Название магазина" fullWidth 
                        defaultValue={initialState.name}
                        onChange={(event) => handleChange(event.target.value, "name")}
                    />
                    <TextField variant="outlined" type="text" size="small" label="Название магазина" fullWidth 
                        defaultValue={initialState.name}
                        onChange={(event) => handleChange(event.target.value, "name")}
                    />
                    <TextField variant="outlined" type="text" size="small" label="Название магазина" fullWidth 
                        defaultValue={initialState.name}
                        onChange={(event) => handleChange(event.target.value, "name")}
                    />
                        email магазина
                    <ReactDadataBox token={DADATA_API_KEY}  type="email" onChange={(suggestion) => handleChange(suggestion, "email")}/>
                    <Button variant="contained" color="primary" onClick={handleAdd}>Добавить магазин</Button>
                </div>
            )}
        </>
    )
}

export default AddPerson;
