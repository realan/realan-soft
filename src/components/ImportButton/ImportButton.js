import React from "react";
import Button from "@material-ui/core/Button";

const ImportButton = ({ activeType, buttonType, onClick }) => {
  return (
    <Button color={activeType === buttonType ? "secondary" : "default"} onClick={onClick}>
      {buttonType}
    </Button>
  );
};

export default ImportButton;
