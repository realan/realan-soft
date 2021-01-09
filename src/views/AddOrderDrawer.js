import React, { useState } from 'react';

import { useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import DatePicker from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';
// import { ReactDadata } from 'react-dadata';
import { ADD_ORDER } from '../GraphQL/Mutations';

const useStyles = makeStyles({
  list: {
    width: 500,
  },
  root: {
    padding: '10px',
  },
});

export default function AddOrderDrawer() {
  const classes = useStyles();

  const [stateDrawer, setStateDrawer] = useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    // if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    //     return;
    // }
    setStateDrawer({ ...stateDrawer, [anchor]: open });
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // const [formState, setFormState] = useState(
  const formState = [
    { type: 'client', val: undefined, label: 'Клиент' },
    { type: 'town', val: undefined, label: 'Город' },
    { type: 'delivery', val: undefined, label: 'ТК' },
  ];

  const handleChange = (event) => {
    // console.log(formState);
    formState.forEach((x) => {
      if (x.type === event.target.name) {
        x.val = event.target.value;
      }
    });
  };

  let handleSubmit = (event) => {
    console.log(formState);
    // event.preventDefault();
    addOrder();
    toggleDrawer(anchor, false);
  };

  let textFields = formState.map((i) => (
    <TextField
      key={i.id}
      id="outlined-basic"
      fullWidth
      name={i.type}
      label={i.label}
      onChange={(e) => handleChange(e)}
    />
  ));

  const anchor = 'right';
  const list = (anchor) => (
    <div className={classes.list} role="dialog">
      <List>
        <form className={classes.root} noValidate autoComplete="off">
          {textFields}
          <div>
            <DatePicker
              selected={startDate}
              showWeekNumbers
              placeholderText="Дата размещения"
              locale={ru}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd-MM-yyyy"
            />
            <DatePicker
              placeholderText="Дата отгрузки"
              selected={endDate}
              locale={ru}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              showWeekNumbers
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="dd-MM-yyyy"
            />
          </div>
          <Button variant="contained" onClick={toggleDrawer(anchor, false)}>
            Отмена
          </Button>
          <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
            Добавить
          </Button>
        </form>
      </List>
    </div>
  );

  let newOrder = {
    customer: formState[0].val,
    date_in: startDate.toISOString(),
    date_out: endDate.toISOString(),
    delivery: formState[2].val,
    town: formState[1].val,
  };

  const [addOrder, { error }] = useMutation(ADD_ORDER, {
    variables: { newOrder },
    refetchQueries: ['ORDERS'],
  });
  if (error) {
    console.log('error addOrder ', error);
  }

  return (
    <div>
      <React.Fragment key={anchor}>
        <Button variant="contained" color="primary" onClick={toggleDrawer(anchor, true)}>
          Новый заказ
        </Button>
        <Drawer anchor={anchor} open={stateDrawer[anchor]} onClose={toggleDrawer(anchor, false)}>
          {/* <ReactDadata token="02698293a1c705c3241ff4206710c67c84eeff56" query="Москва" placeholder="" /> */}
          {list(anchor)}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
