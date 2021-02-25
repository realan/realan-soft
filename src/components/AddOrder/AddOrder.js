import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// import AddAddress from "components/AddAddress/AddAddress";

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }));

const AddOrder = ({ onChange, firms, shops }) => {

    const classes = useStyles();
    const initialState = {
        shop_id: "",
        firm_id: "",
        passport: "",
      };

    const [open, setOpen] = useState(false);
    const [state, setState] = useState(initialState);
    const [firm, setFirm] = useState('');
    const [shop, setShop] = useState('');
  
    const listFirms = firms.map((item, index) => 
        <MenuItem key={index} value={index}>
        {item.name}
        </MenuItem>
    )
    const listShops = shops.map((item, index) => 
        <MenuItem key={index} value={index}>
        {item.name}
        </MenuItem>
    )

    const handleChange = (value, type) => {
        const newData = state;
        switch (type) {
            case "shop":
                newData.shop_id = value;
                setShop(value);
                break;
            case "firm":
                newData.firm_id = value;
                setFirm(value);
                break;
            default: 
                break;
        };
        console.log(newData)
        setState(newData);
      }

    const handleClick = () => { setOpen(!open) };

    const handleAdd = () => { 
        if (state.full_name !== "") {
            onChange(state, "persons");
            setState(initialState);
            setFirm('');
            setShop('');
        }
        setOpen(!open);
    };

    return (
        <>
            <Button variant="outlined" color="primary" onClick={handleClick}>+ заказ</Button>
            { open && (
                <div>
                    <TextField 
                        variant="outlined" type="text" size="small" label="ФИО" fullWidth 
                        defaultValue={initialState.fio}
                        onChange={(event) => handleChange(event.target.value, "fio")}
                    />
                        Телефон
                    <TextField 
                        variant="outlined" type="text" size="small" label="Номер телефона" fullWidth 
                        defaultValue={initialState.name}
                        onChange={(event) => handleChange(event.target.value, "phone")}
                    />
                        email
                    
                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel id="select-person-firm-input">Фирма</InputLabel>
                        <Select
                            labelId="select-person-firm-label"
                            id="select-person-firm"
                            value={firm}
                            onChange={(event) => handleChange(event.target.value, "firm")}
                            label="Firm"
                        >
                            <MenuItem value=""> <em>Нет</em> </MenuItem>
                            {listFirms}
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" size="small" className={classes.formControl}>
                        <InputLabel id="select-person-shop-input">Магазин</InputLabel>
                        <Select
                            labelId="select-person-shop-label"
                            id="select-person-shop"
                            value={shop}
                            onChange={(event) => handleChange(event.target.value, "shop")}
                            label="Магазин"
                        >
                            <MenuItem value=""> <em>Нет</em> </MenuItem>
                            {listShops}
                        </Select>
                    </FormControl>

                    <div>
                        <Button variant="contained" color="primary" onClick={handleAdd}>Добавить контакт</Button>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddOrder;
