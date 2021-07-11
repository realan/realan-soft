import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
// import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
// import Icon from "@material-ui/core/Icon";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
// import Store from "@material-ui/icons/Store";
// import InfoOutline from "@material-ui/icons/InfoOutline";
// import Warning from "@material-ui/icons/Warning";
// import DateRange from "@material-ui/icons/DateRange";
// import LocalOffer from "@material-ui/icons/LocalOffer";
// import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Refresh from "@material-ui/icons/Refresh";
import Edit from "@material-ui/icons/Edit";
// import Place from "@material-ui/icons/Place";
// import ArtTrack from "@material-ui/icons/ArtTrack";
// import Language from "@material-ui/icons/Language";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
// import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
// import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { dailySalesChart } from "variables/charts";

const useStyles = makeStyles(styles);

export default function ChartWidget() {
  const classes = useStyles();

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={4}>
        <Card chart className={classes.cardHover}>
          <CardHeader color="info" className={classes.cardHeaderHover}>
            <ChartistGraph
              className="ct-chart-white-colors"
              data={dailySalesChart.data}
              type="Line"
              options={dailySalesChart.options}
              listener={dailySalesChart.animation}
            />
          </CardHeader>
          <CardBody>
            <div className={classes.cardHoverUnder}>
              <Tooltip
                id="tooltip-top"
                title="Refresh"
                placement="bottom"
                classes={{ tooltip: classes.tooltip }}
              >
                <Button simple color="info" justIcon>
                  <Refresh className={classes.underChartIcons} />
                </Button>
              </Tooltip>
              <Tooltip
                id="tooltip-top"
                title="Change Date"
                placement="bottom"
                classes={{ tooltip: classes.tooltip }}
              >
                <Button color="transparent" simple justIcon>
                  <Edit className={classes.underChartIcons} />
                </Button>
              </Tooltip>
            </div>
            <h4 className={classes.cardTitle}>Daily Sales</h4>
            <p className={classes.cardCategory}>
              <span className={classes.successText}>
                <ArrowUpward className={classes.upArrowCardCategory} /> 55%
              </span>{" "}
              increase in today sales.
            </p>
          </CardBody>
          <CardFooter chart>
            <div className={classes.stats}>
              <AccessTime /> updated 4 minutes ago
            </div>
          </CardFooter>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
