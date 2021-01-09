import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import { prism } from 'react-syntax-highlighter/styles/prism';
// material-ui components
import { makeStyles } from '@material-ui/core/styles';
// material-ui icons
import Remove from '@material-ui/icons/Remove';
import Add from '@material-ui/icons/Add';
import Close from '@material-ui/icons/Close';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
// core components
import Table from 'components/Table/Table.js';
import Button from 'components/CustomButtons/Button.js';
import styles from 'assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js';

import product1 from 'assets/img/product1.jpg';

const useStyles = makeStyles(styles);

export default function DemoTables() {
  const classes = useStyles();
  return (
    <Table
      tableHead={['', 'PRODUCT', 'COLOR', 'SIZE', 'PRICE', 'QTY', 'AMOUNT', '']}
      tableData={[
        [
          <div className={classes.imgContainer}>
            <img src={product1} alt="..." className={classes.img} />
          </div>,
          <span>
            <a href="#jacket" className={classes.tdNameAnchor}>
              Spring Jacket
            </a>
            <br />
            <small className={classes.tdNameSmall}>by Dolce&amp;Gabbana</small>
          </span>,
          'Red',
          'M',
          <span>
            <small className={classes.tdNumberSmall}>€</small> 549
          </span>,
          <span>
            1{' '}
            <div className={classes.buttonGroup}>
              <Button color="info" size="sm" round className={classes.firstButton}>
                <Remove className={classes.icon} />
              </Button>
              <Button color="info" size="sm" round className={classes.lastButton}>
                <Add className={classes.icon} />
              </Button>
            </div>
          </span>,
          <span>
            <small className={classes.tdNumberSmall}>€</small> 549
          </span>,
          <Button className={classes.actionButton}>
            <Close className={classes.icon} />
          </Button>,
        ],
        {
          total: true,
          colspan: '5',
          amount: (
            <span>
              <small>€</small>2,346
            </span>
          ),
        },
        {
          purchase: true,
          colspan: '6',
          col: {
            colspan: 2,
            text: (
              <Button color="info" round>
                Complete Purchase <KeyboardArrowRight className={classes.icon} />
              </Button>
            ),
          },
        },
      ]}
      tableShopping
      customHeadCellClasses={[
        classes.center,
        classes.description,
        classes.description,
        classes.right,
        classes.right,
        classes.right,
      ]}
      // 0 is for classes.center, 2 is for classes.description, 3 is for classes.description
      // 4 is for classes.right, 5 is for classes.right, 6 is for classes.right
      customHeadClassesForCells={[0, 2, 3, 4, 5, 6]}
      customCellClasses={[
        classes.tdName,
        classes.tdNumber,
        classes.tdNumber + ' ' + classes.tdNumberAndButtonGroup,
        classes.tdNumber,
      ]}
      // 1 is for classes.tdName, 4 is for classes.tdNumber, 6 is for classes.tdNumber
      // 5 is for classes.tdNumber + " " + classes.tdNumberAndButtonGroup
      customClassesForCells={[1, 4, 5, 6]}
    />
  );
}
