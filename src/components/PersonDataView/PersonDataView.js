import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    color: theme.palette.text.secondary,
  },
  thirdHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function PersonDataView({value, firms, shops }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [firm, setFirm] = useState('');
  const [shop, setShop] = useState('');


  const handleChangeFirm = (event) => {
    setFirm(event.target.value);
  };
  const handleChangeShop = (event) => {
    setShop(event.target.value);
  };

  const handleChange = () => {
    setExpanded(!expanded);
  };

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

  console.log(shops)

return (
    <div className={classes.root}>
      <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>{value.full_name}</Typography>
          <Typography className={classes.secondaryHeading}>{value.phone}</Typography>
          <Typography className={classes.thirdHeading}>{value.email}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div>
                <div>{value.name}</div>
                <div>{value.surname}</div>
                <div>{value.birthday}</div>
                <div>{(value.gender === 'MALE') ? "муж" : "жен"}</div>

                <FormControl variant="outlined" size="small" className={classes.formControl}>
                  <InputLabel id="select-person-firm-input">Фирма</InputLabel>
                  <Select
                    labelId="select-person-firm-label"
                    id="select-person-firm"
                    value={firm}
                    onChange={handleChangeFirm}
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
                    onChange={handleChangeShop}
                    label="Магазин"
                  >
                    <MenuItem value=""> <em>Нет</em> </MenuItem>
                    {listShops}
                  </Select>
                </FormControl>

            </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

