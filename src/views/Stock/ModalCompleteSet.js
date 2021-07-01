import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputWithButtons from "components/InputWithButtons/InputWithButtons";

import { DataGrid } from "@material-ui/data-grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import { useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 400,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function getUnique(arr, name, name_id) {
  let result = [];
  let list = [];

  for (let obj of arr) {
    if (!list.includes(obj[name])) {
      let o = {
        id: obj[name_id],
        name: obj[name],
      };
      o;
      result.push(o);
      list.push(obj[name]);
    }
  }

  return result;
}

const QUERY_GET_SETS = gql`
  query GetSetsData {
    sets {
      id
      component {
        id
        art
        name
      }
      set {
        art
        name
        id
      }
    }
  }
`;

const ModalCompleteSet = () => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [pos, setPos] = useState("");
  const [count, setCount] = useState(0);

  const [getSetData, { loading, error, data }] = useLazyQuery(QUERY_GET_SETS);

  useEffect(() => {
    if (!loading && data) {
      console.log(data);

      const preparedRows = data.sets.map((item) => {
        return {
          id: item.id,
          set_name: item.set.name,
          set_art: item.set.art,
          set_id: item.set.id,
          component_name: item.component.name,
          component_art: item.component.art,
          component_id: item.component.id,
        };
      });

      let op = getUnique(preparedRows, "set_name", "set_id");
      // console.log(op);
      setOptions(op);
    }
  }, [loading, data]);

  const listSets = options.map((item) => {
    return (
      <MenuItem value={item.id} key={item.id}>
        {item.name}
      </MenuItem>
    );
  });

  const handleChange = (event) => {
    setPos(event.target.value);
  };

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleSubmit = () => {
    console.log(pos);
    const components = data.sets.filter(function (item) {
      return item.set.id === pos;
    });
    console.log(components);
    // setIsOpen(false);
  };
  const handleOpen = () => {
    getSetData();
    setIsOpen(true);
  };

  const handleCountChange = (count) => {
    setCount(count);
  };

  return (
    <>
      <Button color="primary" variant="outlined" onClick={handleOpen}>
        Сформировать комплект
      </Button>
      <Dialog
        open={isOpen}
        fullWidth={true}
        maxWidth="md"
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title"></DialogTitle>

        <DialogContent>
          <FormControl className={classes.formControl}>
            <InputLabel id="simple-select-label_set">Комплект</InputLabel>
            <Select
              labelId="simple-select-label_set"
              id="simple-select-label_set"
              value={pos}
              onChange={handleChange}
            >
              {listSets}
            </Select>
          </FormControl>
          <div>
            <InputWithButtons onChange={handleCountChange} />
          </div>
        </DialogContent>

        <DialogActions>
          <Box flexGrow={1}>
            <Button onClick={handleClose} color="primary">
              Отмена
            </Button>
          </Box>
          <Button onClick={handleSubmit} color="primary">
            Сформировать
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCompleteSet;
