import React from "react";
import TableFormImport from "../components/TableFormImport/TableFormImport";
// import { useQuery } from "@apollo/react-hooks";
import { 
    GET_FIRMS,
 } from "../GraphQL/Queries";
import {
    ADD_FIRMS,
    DELETE_FIRMS,
    UPDATE_FIRMS,
} from "../GraphQL/Mutations";
import LocationCityIcon from '@material-ui/icons/LocationCity';

const SetFirms = () => {

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
        {Header: "Короткое название", accessor: "name_short", type: "text", show: true, required: true, initialState: ""},
        {Header: "Длинное название", accessor: "name_full", type: "text", show: true, required: true, initialState: ""},
        {Header: "Адрес", accessor: "address", type: "text", show: true, required: false, initialState: ""},
        {Header: "ИНН", accessor: "inn", type: "numeric", show: true, required: false},
        {Header: "КПП", accessor: "kpp", type: "numeric", show: true, required: false},
        {Header: "ОКПО", accessor: "okpo", type: "numeric", show: true, required: false},
        {Header: "телефон", accessor: "phone", type: "text", show: true, required: false},
        {Header: "email", accessor: "email", type: "text", show: true, required: false, initialState: ""},
        {Header: "Сайт", accessor: "site", type: "text", show: true, required: false, initialState: ""},
        {Header: "Банковские реквизиты", accessor: "bank_data", type: "text", show: true, required: false, initialState: ""},
        {Header: "Реквизиты договора", accessor: "agreement_data", type: "text", show: true, required: false, initialState: ""},
        {Header: "Тэги", accessor: "tags", type: "text", show: true, required: false, initialState: ""},
        {Header: "Тип", accessor: "type", type: "text", show: true, required: false, initialState: ""},
        {Header: "Директор", accessor: "director_id", type: "integer", show: true, required: false},
        {Header: "Скидка", accessor: "discount", type: "numeric", show: true, required: true, initialState: 0},
        {Header: "Наша фирма", accessor: "our_firm_id", type: "integer", show: true, required: false},
    ];

    const crud = {
        create: ADD_FIRMS,
        read: GET_FIRMS,
        update: UPDATE_FIRMS,
        delete: DELETE_FIRMS,
    };

    const formHeader = {
        icon: <LocationCityIcon fontSize="large" />,
        text: "Данные организации",
        buttonText: "Add Sample",
    };

    const tableName = "firms";

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

export default SetFirms;