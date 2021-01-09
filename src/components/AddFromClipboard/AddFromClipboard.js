import React from "react";
import { useState } from 'react';
// import { gql } from "apollo-boost";
// import { useQuery } from "@apollo/react-hooks";
import Button from '@material-ui/core/Button';
import { DataGrid } from '@material-ui/data-grid';


const AddFromClipboard = (props) => {

    const [state, setState] = useState([]);



    const columns = props.columns;
    console.log(columns);
    const rows = [];

    const parseClipboad = () => {

        navigator.clipboard.readText().then( str => {
            let arr = str.split('\n');
            let result = [];
    
            let header=arr[0].split('\t');

            arr.forEach(function(line, i) {
            if (line) {
                if (i !== 0) {
                    let row = [];
                    let rowIn = line.split("\t"); 
                    let obj={};

                    rowIn.forEach(function(cell, j) {
                        obj[header[j]] = cell.trim();
                        row.push(obj);
                    });
                    // obj.id = i;
                    result.push(obj);
                }
            }
            });
            console.log(result);
            // setState(result);
            // let itemsOrder = result.map(item => {
            //     return {
            //         item: item.id,
            //         qty: item.qty,
            //         order: item.orderId,
            //         note: item.note,
            //     }
            // });
            // props.onChange(itemsOrder);
        } );
    }  

    return (
        <div style={{ height: 600, width: '100%' }}> 
            <div>Скопируй в буфер данные. Потом нажми кнопку</div>
            <Button variant='outlined' color="primary" onClick={parseClipboad}>
                Вставить из буфера 
            </Button>
            <Button variant='outlined' color="secondary" onClick={() => setState([])}>
                Очистить 
            </Button>
            <Button variant='outlined' color="default" >
                Вставить в БД 
            </Button>
            <DataGrid
                columns={columns}
                rows={rows}
                rowHeight={32}
            />                        
        </div>


    )


}


export default AddFromClipboard;
