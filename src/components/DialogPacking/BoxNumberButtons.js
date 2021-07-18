import React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";
import PrintIcon from "@material-ui/icons/Print";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(2),
    },
  },
}));

export default function BoxNumberButtons({
  name = "III",
  onBtnClick,
  onIconClick,
  isActive = false,
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ButtonGroup
        orientation="vertical"
        color="primary"
        size="large"
        aria-label="vertical button group"
      >
        <Button onClick={onBtnClick} size="large">
          {name}
        </Button>
        <IconButton aria-label="delete" className={classes.margin}>
          <PrintIcon onClick={onIconClick} />
        </IconButton>
      </ButtonGroup>
    </div>
  );
}
