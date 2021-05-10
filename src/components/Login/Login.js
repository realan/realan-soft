import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      // "& > *": {
      //   margin: theme.spacing(1),
      // },
    }}));

export default function Login() {
    const classes = useStyles();
  return(
    <div className={classes.root}>
      <h1>Please Log In</h1>
      <form>
        <label>
          <p>Username</p>
          <input type="text" />
        </label>
        <label>
          <p>Password</p>
          <input type="password" />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}
