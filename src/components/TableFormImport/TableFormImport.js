
import React from "react";
import FormTemplate from "forms/FormTemplate";
import ReactTable from "../ReactTable/ReactTable";
import FileLoader from "../FileLoader/FileLoader";
import Button from "components/CustomButtons/Button.js";
import Close from "@material-ui/icons/Close";
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';


// import ToggleTheme from "./ToggleTheme";

// import { Row, Col } from "reactstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import contentData from "../utils/contentData";

import { useQuery, useMutation } from "@apollo/react-hooks";


const TableFormImport = (props) => {

    const columns = React.useMemo(() => props.columns, [props.columns]);

    // graphql chapter
    const addMutation = props.crud.create;
    const getDataQuery = props.crud.read;
    const updateMutation = props.crud.update;
    const deleteMutation = props.crud.delete;
    const tableName = props.tableName;

    const updateCacheUpdate = (cache, { data }) => {
        const updData = data["update_" + tableName].returning[0]
        const existingData = cache.readQuery({ query: getDataQuery });
        const newData = existingData[tableName].map(item => {
            if (item.id === updData.id) {
                return updData;
            } else {
                return item;
            }
        });
        cache.writeQuery({
            query: getDataQuery,
            data: { [tableName]: newData }
        });
    };
    const [UpdateMutation] = useMutation(updateMutation, { update: updateCacheUpdate });


    const updateCacheAdd = (cache, { data }) => {
        const existingData = cache.readQuery({ query: getDataQuery });
        const newData = data["insert_" + tableName].returning[0];
        cache.writeQuery({
            query: getDataQuery,
            data: { [tableName]: [newData, ...existingData[tableName]] }
        });
    };

    const [AddMutation] = useMutation(addMutation, { update: updateCacheAdd });

    const updateCacheDelete = (cache, { data }) => {
        const existingData = cache.readQuery({ query: getDataQuery });
        const arrData = Array.from(existingData[tableName]);
        const newData = arrData.filter(it => it.id !== data["delete_" + tableName].returning[0].id);
        cache.writeQuery({
            query: getDataQuery,
            data: { [tableName]: newData }
        });
    };
    const [DeleteMutation] = useMutation(deleteMutation, { update: updateCacheDelete });

    const { loading, error, data } = useQuery(getDataQuery);
    if (loading) return "Loading....";
    if (error) return `Error! ${error.message}`;

    const addInitialState = {};
    columns.forEach(item => item.initialState !== undefined ? addInitialState[item.accessor] = item.initialState : "");

    // Handlers
    const addHandler = (data) => {
        AddMutation({ variables: data });
    };
    const updateHandler = (data) => {
        UpdateMutation({ variables: data });
    };
    const deleteItem = (id) => {
        DeleteMutation({ variables: { id: id } })
    };

    const getInitialState = (id) => {
        let state = data[tableName].filter(item => {
            return item.id === id
        })[0];
        return state;
    };

    //  console.log(data)
    const tableData = data[tableName].map(item => {
        return {
            actions: (
                <div className="actions-right" style={{ display: "inline-flex", padding: "2px" }}>
                    {/* use this button to add a edit kind of action */}
                    <FormTemplate
                        key={item.id}
                        fields={columns}
                        initialState={getInitialState(item.id)}
                        header={props.formHeader}
                        openIcon={<EditIcon />}
                        onSubmit={updateHandler}
                    />
                    {/* use this button to remove the data row */}
                    <Button
                        justIcon
                        round
                        simple
                        onClick={() => deleteItem(item.id)}
                        color="danger"
                        className="remove"
                    >
                        <Close />
                    </Button>
                </div>
            ),
            ...item,
        }
    })

    // console.log(tableData)

    return (
        <div>
            <FormTemplate
                fields={columns}
                initialState={addInitialState}
                header={props.formHeader}
                openIcon={<AddIcon />}
                onSubmit={addHandler}
            />
            <ReactTable columns={columns} data={tableData} />
            <FileLoader header={columns} handler={addHandler} />
        </div>
    )
};

export default TableFormImport;
