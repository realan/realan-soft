import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FioSuggestions } from "react-dadata";
import ReactDadataBox from "react-dadata-box";
import "react-dadata/dist/react-dadata.css";
import { DADATA_API_KEY } from "constants/dadata";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
// import AddAddress from "components/AddAddress/AddAddress";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const AddPerson = ({ onChange, firms, shops }) => {
  const classes = useStyles();
  const initialState = {
    full_name: "",
    name: "",
    surname: "",
    fio: "",
    email: "",
    phone: "",
    gender: "",
    birthday: null,
    shop_id: null,
    firm_id: null,
    passport: "",
  };

  const [open, setOpen] = useState(false);
  const [state, setState] = useState(initialState);
  const [firm, setFirm] = useState("");
  const [shop, setShop] = useState("");

  const listFirms = firms.map((item, index) => (
    <MenuItem key={index} value={index}>
      {item.name}
    </MenuItem>
  ));
  const listShops = shops.map((item, index) => (
    <MenuItem key={index} value={index}>
      {item.name}
    </MenuItem>
  ));

  const handleChange = (value, type) => {
    const newData = state;
    switch (type) {
      case "full_name":
        newData.full_name = value.value;
        newData.name = value.data.name;
        newData.surname = value.data.surname;
        newData.gender = value.data.gender;
        break;
      case "name":
        // newData.name = value;
        break;
      case "phone":
        newData.phone = value;
        break;
      case "fio":
        newData.fio = value;
        break;
      case "birthday":
        newData.birthday = value;
        break;
      case "email":
        newData.email = value.value;
        break;
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
    }
    console.log(newData);
    setState(newData);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleAdd = () => {
    if (state.full_name !== "") {
      onChange(state, "persons");
      setState(initialState);
      setFirm("");
      setShop("");
    }
    setOpen(!open);
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClick}>
        + контакт
      </Button>
      {open && (
        <div>
          <FioSuggestions
            token={DADATA_API_KEY}
            onChange={(suggestion) => handleChange(suggestion, "full_name")}
          />
          Как обращаться в письмах
          <TextField
            variant="outlined"
            type="text"
            size="small"
            label="Имя"
            fullWidth
            defaultValue={initialState.name}
            onChange={(event) => handleChange(event.target.value, "name")}
          />
          ФИО
          <TextField
            variant="outlined"
            type="text"
            size="small"
            label="ФИО"
            fullWidth
            defaultValue={initialState.fio}
            onChange={(event) => handleChange(event.target.value, "fio")}
          />
          Телефон
          <TextField
            variant="outlined"
            type="text"
            size="small"
            label="Номер телефона"
            fullWidth
            defaultValue={initialState.name}
            onChange={(event) => handleChange(event.target.value, "phone")}
          />
          email
          <ReactDadataBox
            token={DADATA_API_KEY}
            type="email"
            onChange={(suggestion) => handleChange(suggestion, "email")}
          />
          <FormControl variant="outlined" size="small" className={classes.formControl}>
            <InputLabel id="select-person-firm-input">Фирма</InputLabel>
            <Select
              labelId="select-person-firm-label"
              id="select-person-firm"
              value={firm}
              onChange={(event) => handleChange(event.target.value, "firm")}
              label="Firm"
            >
              <MenuItem value="">
                {" "}
                <em>Нет</em>{" "}
              </MenuItem>
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
              <MenuItem value="">
                {" "}
                <em>Нет</em>{" "}
              </MenuItem>
              {listShops}
            </Select>
          </FormControl>
          <div>
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Добавить контакт
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPerson;
