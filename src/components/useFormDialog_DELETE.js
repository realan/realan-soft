import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";

export function useFormDialog(initialFValues, validateOnChange = false, validate) {
  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // console.log(e.target);
    let val = value;
    if (type === "number") {
      val = Number(value);
    }
    setValues({
      ...values,
      [name]: val,
    });
    if (validateOnChange) validate({ [name]: value });
  };

  const resetForm = () => {
    setValues(initialFValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    },
  },
}));

export function FormPop(props) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { children, formName, ...other } = props;
  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => setOpen(!open)}>
        {open ? "Свернуть" : formName}
      </Button>
      {open && (
        <form className={classes.root} autoComplete="off" {...other}>
          {children}
        </form>
      )}
    </>
  );
}
