import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/CustomButtons/Button.js';
import CardIcon from 'components/Card/CardIcon.js';
import EditIcon from '@material-ui/icons/Edit';
import PersonIcon from '@material-ui/icons/Person';
import Check from '@material-ui/icons/Check';

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
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import styles from 'assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js';
import { useQuery } from '@apollo/react-hooks';

import { GET_PERSONS_BY_TYPE } from '../GraphQL/Queries';

const useStyles = makeStyles(styles);

const PersonForm = (props) => {
  const [delivery, setDelivery] = useState(props.initialState);
  const { handler } = props;
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const isUpdate = props.isUpdate;

  const { loading, error, data } = useQuery(GET_PERSONS_BY_TYPE, {
    variables: { typeId: 2 }, // typeId: 2 - delivery person
  });
  if (loading) return 'Loading persons .....';
  if (error) return `Error! ${error.message}`;

  const handleClose = () => {
    setOpen(false);
    setDelivery(props.initialState);
  };

  const handleOpen = () => {
    setOpen(true);
    setDelivery(delivery);
  };

  const handleChange = (name, type) => (event) => {
    let value;
    switch (type) {
      case 'number':
        value = Number(event.target.value);
        break;
      case 'boolean':
        value = event.target.checked;
        break;
      case 'select':
        value = Number(event.target.value);
        break;
      default:
        value = event.target.value;
    }
    setDelivery({ ...delivery, [name]: value });
  };

  let handleOK;
  let ButtonOpen;

  const handleAddPerson = () => {
    alert('addd');
    console.log('add person');
  };

  if (isUpdate) {
    ButtonOpen = (
      <Button justIcon simple color="info" round onClick={handleOpen}>
        <EditIcon />
      </Button>
    );
    handleOK = () => {
      handler({
        id: delivery.id,
        name: delivery.name,
        address: delivery.address,
        phone: delivery.phone,
        site: delivery.site,
        route_order: delivery.route_order,
        print_stickers: delivery.print_stickers,
        contact_id: delivery.contact_id,
      });
      setOpen(false);
    };
  } else {
    ButtonOpen = (
      <Button color="warning" round onClick={handleOpen}>
        Добавить контакт
      </Button>
    );
    handleOK = () => {
      handler({ delivery: delivery });
      setOpen(false);
      setDelivery(props.initialState);
    };
  }

  const selectorItems = data.persons.map((item) => (
    <MenuItem
      classes={{
        root: classes.selectMenuItem,
        selected: classes.selectMenuItemSelected,
      }}
      value={item.id}
      key={item.id}
    >
      {item.name} {item.surname} {item.phone}
    </MenuItem>
  ));

  return (
    <div>
      {ButtonOpen}

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <CardIcon color="info">
            <PersonIcon fontSize="large" />
          </CardIcon>
          Контактные данные
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название"
            type="text"
            fullWidth
            value={delivery.name || ''}
            onChange={handleChange('name', 'text')}
          />
          <TextField
            margin="dense"
            label="Адрес"
            type="text"
            fullWidth
            value={delivery.address || ''}
            onChange={handleChange('address', 'text')}
          />
          <TextField
            margin="dense"
            label="Телефон"
            type="text"
            fullWidth
            value={delivery.phone || ''}
            onChange={handleChange('phone', 'text')}
          />

          <TextField
            margin="dense"
            label="Сайт"
            type="text"
            fullWidth
            value={delivery.site || ''}
            onChange={handleChange('site', 'text')}
          />
          <TextField
            margin="dense"
            label="Contact id"
            type="number"
            fullWidth
            value={delivery.contact_id || ''}
            onChange={handleChange('contact_id', 'number')}
          />
          <FormControl fullWidth className={classes.selectFormControl}>
            <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
              Контактное лицо
            </InputLabel>

            <Select
              MenuProps={{
                className: classes.selectMenu,
              }}
              classes={{
                select: classes.select,
              }}
              value={delivery.contact_id || ''}
              onChange={handleChange('contact_id', 'select')}
            >
              <MenuItem
                classes={{
                  root: classes.selectMenuItem,
                }}
              >
                <Button onClick={handleAddPerson}> Добавить контактное лицо </Button>
              </MenuItem>
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
          <TextField
            margin="dense"
            label="Порядок заезда по маршруту"
            type="number"
            fullWidth
            value={delivery.route_order || ''}
            onChange={handleChange('route_order', 'number')}
          />
          <FormControlLabel
            control={
              <Checkbox
                onClick={handleChange('print_stickers', 'boolean')}
                checked={delivery.print_stickers}
                checkedIcon={<Check className={classes.checkedIcon} />}
                icon={<Check className={classes.uncheckedIcon} />}
                classes={{
                  checked: classes.checked,
                  root: classes.checkRoot,
                }}
              />
            }
            classes={{ label: classes.label }}
            label="Печатать наклейки"
          />
        </DialogContent>

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

PersonForm.propTypes = {
  initialState: PropTypes.object.isRequired,
};

export default PersonForm;
