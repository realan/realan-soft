import React from "react";
import TableFormImport from "../components/TableFormImport/TableFormImport";
import { useQuery } from "@apollo/react-hooks";
import { 
    GET_DELIVERY,
    GET_PERSONS_BY_TYPE
 } from "../GraphQL/Queries";
import {
    ADD_DELIVERY,
    DELETE_DELIVERY,
    UPDATE_DELIVERY,
} from "../GraphQL/Mutations";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';

const SetDelivery = () => {

    const { loading, error, data } = useQuery(GET_PERSONS_BY_TYPE, {
        variables: { typeId: 2 }, // typeId: 2 - delivery person
    });
    if (loading) return "Loading persons .....";
    if (error) return `Error! ${error.message}`;

    const columns = [
        {
            Header: "Действия",
            accessor: "actions",
            width: 85,
            sortable: false,
            filterable: false,
            show: false,
        },
        {
            Header: "id", // to input label too
            accessor: "id",
            type: "integer",
            required: true,
            show: false,
        },
        {
            Header: "Название",
            accessor: "name",
            type: "text",
            required: true,
            initialState: "",
        },
        {
            Header: "Адрес",
            accessor: "address",
            type: "text",
            required: false,
            initialState: "",
        },
        {
            Header: "Телефон",
            accessor: "phone",
            type: "text",
            required: false,
            initialState: "",
        },
        {
            Header: "Сайт",
            accessor: "site",
            type: "text",
            required: false,
            initialState: "",
        },
        {
            Header: "Порядок заезда",
            accessor: "route_order",
            type: "integer",
            required: false,
            initialState: 100,
        },
        {
            Header: "Контакты",
            accessor: "contact_id",
            type: "select",
            selectorSetting: {
                arrData: data.persons,
                inputLabelText: "Контакт",
                showInItem: ["name", "surname", "phone"], //какие значения показывать в selector item 
            },
            required: false,
        },
        {
            Header: "Печатать стикеры",
            accessor: "print_stickers",
            type: "checkbox",
            required: false,
            initialState: true,
        },
    ];

    const crud = {
        create: ADD_DELIVERY,
        read: GET_DELIVERY,
        update: UPDATE_DELIVERY,
        delete: DELETE_DELIVERY,
    };

    const formHeader = {
        icon: <LocalShippingIcon fontSize="large" />,
        text: "Данные транспортной компании",
        buttonText: "Add Sample",
    };

    const tableName = "delivery";

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

export default SetDelivery;