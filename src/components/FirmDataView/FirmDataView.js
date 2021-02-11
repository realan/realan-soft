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
    color: theme.palette.text.secondary,
  },
}));

export default function FirmDataView({value}) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const management = value.managementPost + " " + value.managementName;
  const codes = "ИНН " + value.inn + ", КПП " + value.kpp + ", ОГРН " + value.ogrn + ", ОКПО " + value.okpo;
  const bank = "р/с " + value.account + " в " + value.bank + ", БИК " + value.bic + ", корр/с " + value.corrAccount;

//   console.log(value)

  return (
    <div className={classes.root}>
      <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>{value.name}</Typography>
          <Typography className={classes.secondaryHeading}>Дебиторка, обороты, наша орг</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div>
                <div>{value.address}</div>
                <div>{management}</div>
                <div>{codes}</div>
                <div>{bank}</div>
                <div>{value.email}</div>
            </div>

            {/* <div>{value.managementPost}{" "}{value.managementName}</div>
            <div>ИНН {value.inn} КПП {value.kpp} ОГРН {value.ogrn} ОКПО {value.okpo}</div> */}
          
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

