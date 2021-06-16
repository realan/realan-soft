// https://github.com/CodAffection/Material-UI-Form-Design-and-Validation

import React, { useState } from "react";
import { Button, makeStyles } from "@material-ui/core";
// import Dialog from "@material-ui/core/Dialog";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import DialogActions from "@material-ui/core/DialogActions";

export function useForm(initialFValues, validateOnChange = false, validate) {
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

export function Form(props) {
  const classes = useStyles();
  const { children, ...other } = props;
  return (
    <form className={classes.root} autoComplete="off" {...other}>
      {children}
    </form>
  );
}

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

// export function FormModal(props) {
//   const classes = useStyles();
//   const { children, formName, open, onClose, ...other } = props;
//   console.log("Modalprops", props);

//   return (
//     <>
//       <Dialog
//         open={open}
//         onClose={onClose}
//         // maxWidth="md"
//         // minWidth="md"
//         aria-labelledby="dialog-title"
//       >
//         <DialogTitle id="dialog-title">{formName}</DialogTitle>

//         <DialogContent>
//           <form className={classes.root} autoComplete="off" {...other}>
//             {children}
//           </form>
//         </DialogContent>
//         {/*
//         <DialogActions>
//           <Box flexGrow={1}>
//             <Button onClick={} color="primary">
//               Отмена
//             </Button>
//           </Box>
//           <Button onClick={} color="primary">
//             Добавить заказ
//           </Button>
//         </DialogActions> */}
//       </Dialog>
//     </>
//   );
// }
