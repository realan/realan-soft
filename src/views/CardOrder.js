import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import LinearProgress from "@material-ui/core/LinearProgress";
// import CardMedia from '@material-ui/core/CardMedia';
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { green } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import CreateIcon from "@material-ui/icons/Create";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 230,
    padding: 3,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: green[500],
  },
}));

export default function RecipeReviewCard() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [payment, setPayment] = React.useState("red");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handlePaymentClick = () => {
    setPayment("green");
  };

  let progressVal = 95;

  return (
    <Card className={classes.root}>
      <LinearProgress variant="determinate" color="secondary" value={progressVal} />

      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar} sizes="10">
            P
          </Avatar>
        }
        title="Сувениры Регионов"
        subheader="Оренбург"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Мрамор (лазер)
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Основной магазин
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          ТК Кит
        </Typography>
      </CardContent>
      <CardActions disableSpacing fontSize="small">
        <IconButton aria-label="bill">
          <AssignmentOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="payment" onClick={handlePaymentClick}>
          <MonetizationOnIcon htmlColor={payment} fontSize="small" />
        </IconButton>
        <IconButton aria-label="invoice" fontSize="small">
          <DescriptionOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="settings" fontSize="small">
          <CreateIcon fontSize="small" />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          fontSize="small"
        >
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>12 средних наклеек "Оренбург"</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
