import React from "react";
import { TextField } from "@material-ui/core";

export default function Input(props) {
  const { name, label, value, error = null, type = "text", onChange } = props;
  return (
    <TextField
      variant="outlined"
      label={label}
      size="small"
      name={name}
      value={value}
      type={type}
      onChange={onChange}
      {...(error && { error: true, helperText: error })}
    />
  );
}
