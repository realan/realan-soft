import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
// import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import CardHeader from '@material-ui/core/CardHeader';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
// import Avatar from '@material-ui/core/Avatar';
// import IconButton from '@material-ui/core/IconButton';
import { green } from '@material-ui/core/colors';
import InputGroup from 'components/InputGroup/InputGroup';

const useStyles = makeStyles({
  root: {
    maxWidth: 250,
  },
  title: {
    backgroundColor: green[300],
  },
  subtitle: {
    backgroundColor: green[100],
  },
});

const defaultProps = {
    bgcolor: 'background.paper',
    m: 1,
    border: 2,
    borderRadius: 6,
    style: { width: '7rem', height: '3rem' },
  };

export default function CardPosInOrder(props) {
  const classes = useStyles();
  console.log(props)


  return (
    <Card className={classes.root}>
        <CardContent>
            <Typography className={classes.title} color="textPrimary" >
                {props.value.town}
            </Typography>
            <Typography className={classes.subtitle} color="textPrimary" gutterBottom>
                {props.value.customer}
            </Typography>
            <Typography color="textSecondary" variant="caption" gutterBottom>
                {props.value.dateOut}
            </Typography>
            <Typography color="textSecondary" variant="caption" gutterBottom>
                {props.value.note}
            </Typography>

            <Box display="flex" justifyContent="center">
                <Box borderColor="primary.main" {... defaultProps}>
                    Нужно {props.value.needQty}
                </Box>
                <Box borderColor="success.main" {... defaultProps}>
                    заказ {props.value.orderQty}
                </Box>
            </Box>

            <Box mr={1}>
                Д <InputGroup />
            </Box>
            
            <Box mr={1}>
                С<InputGroup />
            </Box>
        </CardContent>

    </Card>
  );
}