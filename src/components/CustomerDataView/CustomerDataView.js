import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FirmDataView from "components/FirmDataView/FirmDataView";
import PersonDataView from "components/PersonDataView/PersonDataView";
import ShopDataView from "components/ShopDataView/ShopDataView";
import AddShop from "components/AddShop/AddShop";
import AddFirm from "components/AddFirm/AddFirm";
import AddPerson from "components/AddPerson/AddPerson";
// import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
// import Fab from "@material-ui/core/Fab";
// import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    color: theme.palette.text.secondary,
  },
  thirdHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

// id
// name
// dealer
// saldo
// firms {
//     id
//     name
// }
// shops {
//     id
//     city
//     name
// }
// persons {
//     id
//     full_name
//     phone
//     email
//     firm_id
//     shop_id
// }

export default function CustomersDataView({ value }) {
  const classes = useStyles();

  const initialState = {
    firms: [],
    shops: [],
    persons: [],
  };
  const [state, setState] = useState(initialState);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setState(value);
  }, [value, setState]);

  const listFirms = state.firms.map((item) => (
    <div key={item.id}>
      <FirmDataView value={item} />
    </div>
  ));
  const listShops = state.shops.map((item) => (
    <div key={item.id}>
      <ShopDataView value={item} />
    </div>
  ));
  const listPersons = state.persons.map((item) => (
    <div key={item.id}>
      <PersonDataView value={item} />
    </div>
  ));

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const handleChangeData = (newData, type) => {
    const obj = { ...state };
    const arr = [...state[type], newData];
    obj[type] = arr;
    setState(obj);
  };

  return (
    <div className={classes.root}>
      <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>{value.name}</Typography>
          <Typography className={classes.secondaryHeading}>{value.dealer}</Typography>
          <Typography className={classes.thirdHeading}>{value.saldo}</Typography>
          <Typography className={classes.thirdHeading}>
            {/* <Fab color="primary" aria-label="add" size="small" component="span" onClick={() => alert("hkjhk")}>
                <AddShoppingCartIcon />
            </Fab> */}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.root}>
            <AddFirm onChange={handleChangeData} />
            {listFirms}
            <AddShop onChange={handleChangeData} />
            {listShops}
            <AddPerson onChange={handleChangeData} firms={state.firms} shops={state.shops} />
            {listPersons}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
