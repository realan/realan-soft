import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from "@material-ui/core/DialogTitle";
import { DataGrid } from '@material-ui/data-grid';
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
  }

const QUERY_GET_RESORT = gql`  
  query GetResort ($startDate: timestamptz!, $endDate: timestamptz!) {
    mr_moving(
      where: {
        date: {_gte: $startDate, _lte: $endDate}, 
        mr_move_from: {id: {_eq: 5}}, 
        mr_move_to: {id: {_eq: 3}}
      },
      order_by: {date: desc}
      ){
      id
      date
      mr_price {
        art
        name
      }
      qty
    }
  }
`; 


const ModalResorting = ({startDate, endDate}) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [rows, setRows] = useState([]);

    const columns = [
        { field: 'id', headerName: 'id', width: 10 },
        { field: 'name', headerName: 'Название', width: 250 },
        { field: 'art', headerName: 'Артикул', width: 100 },
        { field: 'qty', headerName: 'К-во', width: 100 },
        { field: 'date', headerName: 'Дата коррекции', width: 250 },

      ];

    const { loading, error, data } = useQuery(QUERY_GET_RESORT, {
        variables: {startDate: startDate, endDate: endDate}
    });

    useEffect(() => {
      if (!loading && data) { 
        console.log(data)
        
        const preparedRows = data.mr_moving.map( item => {
            return {
                id: item.id,
                name: item.mr_price.name,
                art: item.mr_price.art,
                date: item.date,
                qty:item.qty,
            }
        })
        setRows(preparedRows);
      }
    }, [loading, data]);

    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;

    const handleClose = () => { setIsOpen(false) };

    return (
        <>
            <Button color="primary" variant="outlined" onClick={ () => setIsOpen(true) }>
                Небитуха
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
                    {Boolean(rows.length) && (
                        <div style={{ height: 500, width: "100%" }}>
                            <DataGrid 
                            rows={rows} 
                            columns={columns} 
                            rowHeight={32} 
                            />
                        </div>
                    )}
                </DialogContent>

                <DialogActions>
                    <Box flexGrow={1}>
                        <Button onClick={handleClose} color="primary">
                        Отмена
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

        </>

    );
}

export default ModalResorting;
