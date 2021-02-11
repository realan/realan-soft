import React, { useState } from "react";
import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";
import { DADATA_API_KEY } from "constants/dadata";
// import { Button } from "@material-ui/core";


const AddAddress = ({ type, onSubmit }) => {

    const [state, setState] = useState({
        full: "",
        city: "",
        postal_code: "",
      });


    const handleAddress = (suggestion) => {
        setState({
          full: suggestion.unrestricted_value,
          city: suggestion.data.city,
          postal_code: suggestion.data.postal_code,
        })
      }

    const handleClick = () => {}

    return (
        <>
            <AddressSuggestions token={DADATA_API_KEY} onChange={(suggestion) => handleAddress(suggestion)} />
            <div> {state.full} </div>
        </>
    )
}

export default AddAddress;