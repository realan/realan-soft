import React from "react";
import { useState } from 'react';
// import { gql } from "apollo-boost";
// import { useQuery } from "@apollo/react-hooks";
import Button from '@material-ui/core/Button';
import { DataGrid } from '@material-ui/data-grid';


const AddFromClipboard = (props) => {

    const [state, setState] = useState([]);



    const value = props.value
    const columns = value.map( (item, id) => {
        let head = {}
        // for (const key in item) { 
        //     head.field=${key}, 
        //     head.headerName=${key}
        // }
        return  head    
    });
    console.log(columns);

    // const columns = [
    //     { field: 'id', headerName: 'id', width: 30 },
    //     { field: 'name', headerName: 'Наименование', type: "text", width: 200 },
    //     { field: 'art', headerName: 'Артикул', type: "text", width: 100 },
    //     { field: 'qty', headerName: 'К-во', type: "number", width: 80 },
    //     { field: 'price', headerName: 'Цена', type: "number", width: 100 },
    //     { field: 'note', headerName: 'Примечание', type: "text", width: 200 },  
    //     { field: 'itemId', headerName: 'ID Item', type: "number", width: 30 },  
    // ];

    // const rows = [];

    const parseClipboad = () => {

        navigator.clipboard.readText().then( str => {
            let arr = str.split('\n');
            let result = [];
    
            // let header=arr[0].split('\t');
            // header.map( item => {
            //     item.trim();
            //     console.log(item);
            //     return item;
            // });

            let header=props.value;
// !!! вставить проверку, значения в массиве из пропса совпадает с заголовками с буфере по порядку
            console.log(header)

            arr.forEach(function(line, i) {
                if (line) {
                    if (i !== 0) {
                        let row = [];
                        let rowIn = line.split("\t"); 
                        let obj={};

                        rowIn.forEach(function(cell, j) {
                            obj[header[j]] = cell.trim();
                            // console.log(obj);
                            row.push(obj);
                        });
                        // obj.id = i;
                        result.push(obj);
                    }
                }
            });
            console.log(result);
            setState(result);
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

    const insertInDb = () => {}

    return (
        <div style={{ height: 600, width: '100%' }}> 
            <div>Скопируй в буфер данные. Потом нажми кнопку</div>
            <Button variant='outlined' color="primary" onClick={parseClipboad}>
                Вставить из буфера 
            </Button>
            <Button variant='outlined' color="secondary" onClick={() => setState([])}>
                Очистить 
            </Button>
            <Button variant='outlined' color="default" onClick={insertInDb}>
                Вставить в БД 
            </Button>
            <DataGrid
                columns={columns}
                rows={state}
                rowHeight={32}
            />                        
        </div>


    )


}


export default AddFromClipboard;
