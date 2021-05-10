import React from "react";
// import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(800 + theme.spacing(2) * 2)]: {
      width: 800,
      marginLeft: theme.spacing(2),
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(2),
    [theme.breakpoints.up(800 + theme.spacing(3) * 2)]: {
      width: 800,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(3),
    },
  },
}));

export default function FormSection({ children, title }) {
  const classes = useStyles();

  return (
    <React.Fragment>
      {/* <main className={classes.layout}> */}
      <Paper className={classes.paper}>
        {/* {icon} */}
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {children}
      </Paper>
      {/* </main> */}
    </React.Fragment>
  );
}
