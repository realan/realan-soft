import React, {useState, useEffect} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { GET_PRICE } from "../../GraphQL/Queries"
import { ADD_ITEM } from "../../GraphQL/Mutations"
import { useQuery, useMutation } from "@apollo/react-hooks";
import Autocomplete from "@material-ui/lab/Autocomplete";

const AddItemInOrder = ({orderId}) => {
    
    const initialState = {
        count: 0,
        note: '',
        name: '',
        art: '',
        priceOpt: 0,
        priceRozn: 0,
    }

    const [isOpen, setIsOpen] = useState(false);
    const [state, setState] = useState(initialState);
    const [options, setOptions] = useState([]);
    const [AddItems] = useMutation(ADD_ITEM);

    const {loading, error, data} = useQuery(GET_PRICE);

    useEffect( () => {
        if (!loading && data) {
            setOptions(data.mr_price);
        }
    }, [loading, data])

    if (loading) return "Loading .....";
    if (error) return `Error! ${error.message}`;

    const handleChange = (type) => (event) => {
        setState({ ...state, [type]: event.target.value });
      };

    const getInput = (event, val) => {
        if (val !== null) {
          let obj = {
            ...state,
            name: val.name,
            art: val.art,
            itemId: val.id,
            priceOpt: val.price_opt,
            priceRozn: val.price_rozn,
          };
          setState(obj);
        }
    };

    const handleClose = () => {
        setState(initialState);
        setIsOpen(false);
    };

    const handleOk = () => {
        // console.log(state)
        if (state.counter !== 0){
            const addData = {
                order: orderId,
                item: state.itemId,
                qty: state.count,
                note: state.note,
            };
            // console.log(addData);
            AddItems({ variables: {addData: addData }});
        }
        setState(initialState);
        setIsOpen(false);
    };


    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                aria-label="редактировать"
                component="span"
                onClick={() => setIsOpen(true) }
            >
                Добавить позицию
            </Button>

            <Dialog
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="add-item-title"
                maxWidth="sm"
            >
            <DialogTitle id="add-item-title">Добавляем позицию в заказ</DialogTitle>
            <DialogContent>
                <Autocomplete
                    id="price-combo-box"
                    // open={true}
                    options={options.sort((a, b) => -b.name.localeCompare(a.name))}
                    // groupBy={(option) => option.town}
                    getOptionLabel={(option) => option.name}
                    onChange={getInput}
                    renderInput={(params) => <TextField {...params} label="Название" fullWidth required />}
                />
                <TextField
                    margin="dense"
                    label="Кол-во"
                    type="number"
                    fullWidth
                    value={state.count}
                    onChange={handleChange("count")}
                />
                <TextField
                    margin="dense"
                    label="Примечание"
                    type="text"
                    fullWidth
                    value={state.note}
                    onChange={handleChange("note")}
                />
                <TextField
                    margin="dense"
                    label="Цена опт"
                    type="number"
                    fullWidth
                    value={state.priceOpt}
                    onChange={handleChange("priceOpt")}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Отмена
                </Button>
                <Button onClick={handleOk} color="primary">
                    Добавить
                </Button>
            </DialogActions>
        </Dialog>
    </>
    )
}


export default AddItemInOrder;