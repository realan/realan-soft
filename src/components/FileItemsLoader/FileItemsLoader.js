/* xlsx.js (C) 2013-present  SheetJS -- http://sheetjs.com */
/* Notes:
   - usage: `ReactDOM.render( <SheetJSApp />, document.getElementById('app') );`
   - xlsx.full.min.js is loaded in the head of the HTML page
   - this script should be referenced with type="text/babel"
   - babel.js in-browser transpiler should be loaded before this script
*/
import React, { useState} from "react";
import XLSX from "xlsx";
import Table from "../tables/Table"

const FileLoader = (props) => {

    const [state, setState] = useState({
        data: [], /* Array of Arrays e.g. [["a","b"],[1,2]] */
        cols: [],  /* Array of column objects e.g. { name: "C", K: 2 } */
        dataDB: [],
    });

    const [stateBtn, setStateBtn] = useState(false);

    const handleFile = (file/*:File*/) => {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            /* Update state */
            setState({ data: data, cols: make_cols(ws['!ref']), dataDB: convertToDB(data) });
        };
        if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    };

    const updateDB = () => {
        setStateBtn(true);
        state.dataDB.map(data => props.handler({addData: data}));
    };

    console.log(props)
    
    return (
        <DragDropFile handleFile={handleFile}>
            <DataInput handleFile={handleFile} />
            <Table columns={props.header} data={state.dataDB} />
        </DragDropFile>
    );
};


const DragDropFile = (props) => {
    const suppress = (evt) => { evt.stopPropagation(); evt.preventDefault(); };
    const onDrop = (evt) => {
        evt.stopPropagation(); evt.preventDefault();
        const files = evt.dataTransfer.files;
        if (files && files[0]) props.handleFile(files[0]);
    };
    return (
        <div onDrop={onDrop} onDragEnter={suppress} onDragOver={suppress}>
            {props.children}
        </div>
    );
}

/*
  Simple HTML5 file input wrapper
  usage: <DataInput handleFile={callback} />
    handleFile(file:File):void;
*/

const DataInput = (props) => {
    const handleChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) props.handleFile(files[0]);
    };
    return (
        <form className="form-inline">
            <div className="form-group">
                <label htmlFor="file">Импорт файла</label>
                <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={handleChange} />
            </div>
        </form>
    );
}


/* list of supported file types */
const SheetJSFT = [
    "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function (x) { return "." + x; }).join(",");

/* generate an array of column objects */
const make_cols = refstr => {
    let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i }
    return o;
};

/* Конвертируем данные для бд */
const convertToDB = (arrData) => {
    let arrKeys = arrData.shift();
    let arr = [];
    for (let j = 0; j < arrData.length; j++) {
        let o = {};
        for (let i = 0; i < arrKeys.length; i++) {
            let val = arrData[j][i];
            o[arrKeys[i]] = (val === undefined) ? null : val;
        }
        // o.__typename="delivery";
        arr.push(o);
    }
    console.log('arr', arr);
    
    return arr;
};

export default FileLoader;