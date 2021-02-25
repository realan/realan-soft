import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';




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
}));

export default function PersonDataView({value}) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);


  const handleChange = () => {
    setExpanded(!expanded);
  };

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
                <div>{value.shop_id}</div>
                <div>{value.firm_id}</div>
            </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

