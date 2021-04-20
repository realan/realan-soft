import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { deepOrange, deepPurple, green, red, teal, blueGrey, lime, amber } from "@material-ui/core/colors";
import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import StoreOutlinedIcon from "@material-ui/icons/StoreOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import ForwardOutlinedIcon from "@material-ui/icons/ForwardOutlined";
import GetAppOutlinedIcon from "@material-ui/icons/GetAppOutlined";
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';

// import { useState } from "react";
// import UpdateOrder from "components/OrderData/UpdateOrder";
// import Fab from "@material-ui/core/Fab";
// import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex",
    // justifyContent: "center",
    // flexWrap: "wrap",
    // "& > *": {
    //   margin: theme.spacing(1),
    // },
  },
  green: {
    color: theme.palette.getContrastText(green[200]),
    backgroundColor: green[200],
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  teal: {
    color: theme.palette.getContrastText(teal[200]),
    backgroundColor: teal[200],
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  blueGrey: {
    color: theme.palette.getContrastText(blueGrey[200]),
    backgroundColor: blueGrey[200],
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  lime: {
    color: theme.palette.getContrastText(lime[200]),
    backgroundColor: lime[200],
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  amber: {
    color: theme.palette.getContrastText(amber[200]),
    backgroundColor: amber[200],
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  red: {
    color: theme.palette.getContrastText(red[700]),
    backgroundColor: red[700],
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[300]),
    backgroundColor: deepOrange[300],
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default function OrderInfoButtons({ params }) {
  const classes = useStyles();
  console.log("avatars", params);
  const classesList = {};


  switch(params.row.our_firm_id) {
    case 1:
      classesList.ourFirm = classes.teal;
      break;
    case 2:
      classesList.ourFirm = classes.blueGrey;
      break;
    case 3:
      classesList.ourFirm = classes.lime;
      break;
    case 4:
      classesList.ourFirm = classes.amber;
      break;
    default:
      classesList.ourFirm = classes.red;
      break;
  }

  switch(params.row.price_type_id) {
    case 1:
      classesList.priceType = classes.teal;
      break;
    case 2:
      classesList.priceType = classes.blueGrey;
      break;
    case 3:
      classesList.priceType = classes.amber;
      break;
    default:
      classesList.priceType = classes.red;
      break;
  }

  params.row.firm ? (classesList.firm = classes.green) : (classesList.firm = classes.red);
  params.row.person ? (classesList.person = classes.green) : (classesList.person = classes.red);
  params.row.delivery_id
    ? (classesList.delivery = classes.green)
    : (classesList.delivery = classes.red);
  params.row.shop ? (classesList.shop = classes.green) : (classesList.shop = classes.red);

  return (
    <AvatarGroup max={7} spacing={4} className={classes.root}>
      <Avatar alt="PriceType" className={classesList.priceType}>
        <AttachMoneyOutlinedIcon fontSize="small" />
      </Avatar>
      <Avatar alt="OurFirm" className={classesList.ourFirm}>
        <ForwardOutlinedIcon fontSize="small" />
      </Avatar>
      <Avatar alt="Firm" className={classesList.firm}>
        <GetAppOutlinedIcon fontSize="small" />
      </Avatar>
      <Avatar alt="Person" className={classesList.person}>
        <PersonOutlineOutlinedIcon fontSize="small" />
      </Avatar>
      <Avatar alt="Shop" className={classesList.shop}>
        <StoreOutlinedIcon fontSize="small" />
      </Avatar>
      <Avatar alt="Delivery" className={classesList.delivery}>
        <LocalShippingOutlinedIcon fontSize="small" />
      </Avatar>
      { params.row.note_order &&  <Avatar alt="OrderNote" className={classes.orange}>
        <CommentOutlinedIcon fontSize="small" />
      </Avatar>}
    </AvatarGroup>
  );
}
{
  /* <div className={classes.root}></div>

      <Chip size="small" avatar={<Avatar>M</Avatar>} label="" />
      <Chip
        size="small"
        avatar={<Avatar color={classes.orange}>M</Avatar>}
        label=""
        color={classes.orange}
      />
      <Chip size="small" avatar={<Avatar>M</Avatar>} label="" onClick={handleClick} />
    </div>  */
}
