import React from "react";
import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import OrderForm from "./OrderForm";
import {newOrderFormState} from "./orderConstants";
import {ADD_ORDER} from "./orderConstants";

export default function NewOrder() {
    const [open, setOpen] = useState(false);
    const [orderData, setOrderData] = useState(newOrderFormState);
    const [AddOrder, { loading, error }] = useMutation(ADD_ORDER);

    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;

    const handleChange = (type, value) => {
        console.log("orderData", orderData)
        setOrderData((prevState) => ({ ...prevState, [type]: value }));
    };

    const handleSubmit = () => {
        AddOrder();
        setOrderData(newOrderFormState);
    }

    const handleCancel = () => {
        setOrderData(newOrderFormState);
        setOpen(false);
    }
  
    return (
        <>
            <Button variant="outlined" color="primary" onClick={() => setOpen(!open)}>
                {open ? "Свернуть" : "Новый заказ"}
            </Button>
            { open && <OrderForm 
                orderData={orderData} 
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />}
        </>

    )
  }