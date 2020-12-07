import React from "react";
import TableFormImport from "../components/TableFormImport/TableFormImport";
import { format } from "date-fns";
import { 
    GET_ORDERS,
 } from "../GraphQL/Queries";
import {
    ADD_ORDERS,
    DELETE_ORDERS,
    UPDATE_ORDERS,
} from "../GraphQL/Mutations";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const SetOrders = () => {

    const columns = [
        {
            Header: "Действия",
            accessor: "actions",
            width: 85,
            sortable: false,
            filterable: false,
            show: false,
        },
        {Header: "id",              accessor: "id", type: "integer", show: false, required: true},
        {Header: "Дата размещения", accessor: "date_in", type: "date", show: true, required: true, initialState: new Date(), 
            Cell: ({value}) => {return format(new Date(value), 'dd.MM.yyyy' )}},
        {Header: "Дата отгрузки",   accessor: "date_out", type: "date", show: true, required: false, initialState: new Date(),
            Cell: ({value}) => {return format(new Date(value), 'dd.MM.yyyy' )}},
        {Header: "Город",           accessor: "town", type: "text", show: true, required: true, initialState: ""},
        {Header: "ТК", accessor: "delivery", type: "text", show: true, required: false, initialState: ""},
        {Header: "Заказчик",        accessor: "customer_id", type: "integer", show: true, required: false},
        {Header: "Магазин заказчика", accessor: "customer_shop_id", type: "integer", show: true, required: false},
        {Header: "Доки на фирму",   accessor: "firm_id", type: "integer", show: true, required: false},
        {Header: "От какой нашей фирмы доки", accessor: "our_firm_id", type: "integer", show: true, required: false},
        {Header: "Контактное лицо", accessor: "contact_person_id", type: "integer", show: true, required: false},
        {Header: "ТК id",           accessor: "delivery_id", type: "integer", show: true, required: false},
        {Header: "ЖУ",              accessor: "packing_note", type: "text", show: true, required: false, initialState: ""},
        {Header: "Получатель (фирма)", accessor: "consignee_firm_id", type: "integer", show: true, required: false, },
        {Header: "Получатель ЧЛ",   accessor: "consignee_person_id", type: "integer", show: true, required: false},
    ];

    const crud = {
        create: ADD_ORDERS,
        read: GET_ORDERS,
        update: UPDATE_ORDERS,
        delete: DELETE_ORDERS,
    };

    const formHeader = {
        icon: <ShoppingCartIcon fontSize="large" />,
        text: "Данные заказа",
        buttonText: "Add Sample",
    };

    const tableName = "orders";

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

export default SetOrders;