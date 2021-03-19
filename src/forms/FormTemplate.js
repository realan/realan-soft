import React, { useState } from "react";
// import PropTypes from 'prop-types';
import Button from "components/CustomButtons/Button.js";
// import Datetime from "react-datetime";
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
// import { parseISO, format } from 'date-fns';
// import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  TextField,
  Select,
} from "@material-ui/core";
import CardIcon from "components/Card/CardIcon.js";
import styles from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(styles);

const FormTemplate = (props) => {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState(props.initialState);
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOK = () => {
    console.log(formState);
    if (props.initialState.id) {
      // было (!!props.initialState.id) if "id" defined then update mutation, else add
      const result = formState;
      delete result.__typename;
      props.onSubmit(result);
    } else {
      props.onSubmit({ addData: formState });
      setFormState(props.initialState);
    }
    setOpen(false);
  };
  const handleCheck = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.checked });
  };
  const handleChange = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };
  const handleIntegerChange = (event) => {
    setFormState({ ...formState, [event.target.name]: Number(event.target.value) });
  };

  let selectorList = 0;
  let showInItem = 0;
  let selectorItems = 0;

  const fieldsList = props.fields
    .filter((item) => item.show !== false)
    .map((item, index) => {
      let fieldItem;
      switch (item.type) {
        case "text":
          fieldItem = (
            <TextField
              key={index}
              name={item.accessor}
              margin="dense"
              label={item.Header}
              type="text"
              fullWidth
              value={formState[item.accessor] || ""}
              onChange={handleChange}
            />
          );
          break;
        case "integer":
          fieldItem = (
            <TextField
              key={index}
              name={item.accessor}
              margin="dense"
              label={item.Header}
              type="number"
              fullWidth
              value={formState[item.accessor] || ""}
              onChange={handleIntegerChange}
            />
          );
          break;
        case "numeric":
          fieldItem = (
            <TextField
              key={index}
              name={item.accessor}
              margin="dense"
              label={item.Header}
              type="number"
              fullWidth
              value={formState[item.accessor]}
              onChange={handleIntegerChange}
            />
          );
          break;
        case "checkbox":
          fieldItem = (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={formState[item.accessor]}
                  onChange={handleCheck}
                  name={item.accessor}
                  color="primary"
                />
              }
              label={item.Header}
            />
          );
          break;
        case "date":
          fieldItem = (
            <div key={index}>
              <InputLabel className={classes.label}>{item.Header}</InputLabel>
              <br />
              {/* <FormControl fullWidth>
                            <Datetime
                                locale="ru"
                                timeFormat={false}
                                closeOnSelect={true}
                                inputProps={
                                    { placeholder: formState[item.accessor] || "" },
                                    { onChange: console.log(date)}
                                }
                            />
                        </FormControl> */}
              <FormControl fullWidth>
                <DatePicker
                  selected={new Date(formState[item.accessor])}
                  name={item.accessor}
                  showWeekNumbers
                  showYearDropdown
                  showMonthDropdown
                  placeholderText={item.Header}
                  locale={ru}
                  value={formState[item.accessor] || ""}
                  onChange={(date) => {
                    setFormState({ ...formState, [item.accessor]: date });
                  }}
                  dateFormat="dd-MM-yyyy"
                />
              </FormControl>
            </div>
          );
          break;
        case "select":
          selectorList = item.selectorSetting.arrData;
          showInItem = item.selectorSetting.showInItem;
          selectorItems = selectorList.map((li) => {
            let menuItemText = showInItem.reduce(
              (text, it) => text + (li[it] !== null ? li[it] : "") + " ",
              ""
            );
            return (
              <MenuItem
                classes={{
                  root: classes.selectMenuItem,
                  selected: classes.selectMenuItemSelected,
                }}
                value={li.id}
                key={li.id}
              >
                {menuItemText}
              </MenuItem>
            );
          });

          fieldItem = (
            <FormControl fullWidth className={classes.selectFormControl} key={index}>
              <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
                {item.selectorSetting.inputLabelText}
              </InputLabel>

              <Select
                MenuProps={{
                  className: classes.selectMenu,
                }}
                classes={{
                  select: classes.select,
                }}
                name={item.accessor}
                value={formState[item.accessor] || ""}
                onChange={handleChange}
              >
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected,
                  }}
                >
                  ...
                </MenuItem>
                {selectorItems}
              </Select>
            </FormControl>
          );
          break;
        default:
      }
      return fieldItem;
    });

  return (
    <div>
      <Button justIcon simple color="info" round onClick={handleOpen}>
        {props.openIcon}
      </Button>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <CardIcon color="info">{props.header.icon}</CardIcon>
          {props.header.text}
        </DialogTitle>

        <DialogContent>{fieldsList}</DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleOK} color="success">
            ОК
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

FormTemplate.propTypes = {
  // handler: PropTypes.func.isRequired,
  // initialState: PropTypes.object.isRequired,
  // fields:PropTypes.arrayOf(PropTypes.object).isRequired,
  // header:PropTypes.object.isRequired,
};

export default FormTemplate;
