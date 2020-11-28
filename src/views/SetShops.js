import React from "react";
import TableFormImport from "../components/TableFormImport/TableFormImport";
// import { useQuery } from "@apollo/react-hooks";
import { 
    GET_SHOPS,
 } from "../GraphQL/Queries";
import {
    ADD_SHOPS,
    DELETE_SHOPS,
    UPDATE_SHOPS,
} from "../GraphQL/Mutations";
import StoreIcon from '@material-ui/icons/Store';

const SetShops = () => {

    const columns = [
        {
            Header: "Действия",
            accessor: "actions",
            width: 85,
            sortable: false,
            filterable: false,
            show: false,
        },
        {Header: "id", accessor: "id", type: "integer", show: false, required: true},
        {Header: "Название", accessor: "name", type: "text", show: true, required: true, initialState: ""},
        {Header: "Город", accessor: "town", type: "text", show: true, required: true, initialState: ""},
        {Header: "Адрес", accessor: "address", type: "text", show: true, required: false, initialState: ""},
        {Header: "Контакт", accessor: "contact_id", type: "integer", show: true, required: false, initialState: undefined},
        {Header: "Тэги", accessor: "tags", type: "text", show: true, required: true, initialState: ""},
        {Header: "Фирмы", accessor: "firms_ids", type: "text", show: true, required: false, initialState: ""},
        {Header: "Фирма", accessor: "firm_id", type: "integer", show: true, required: false, initialState: undefined},
    ];

    const crud = {
        create: ADD_SHOPS,
        read: GET_SHOPS,
        update: UPDATE_SHOPS,
        delete: DELETE_SHOPS,
    };

    const formHeader = {
        icon: <StoreIcon fontSize="large" />,
        text: "Данные магазина",
        buttonText: "Add Sample",
    };

    const tableName = "shops";

    return (
        <div>
            <TableFormImport
                columns={columns}
                crud={crud}
                tableName={tableName}
                formHeader={formHeader}
            />
        </div>
    )

}

export default SetShops;