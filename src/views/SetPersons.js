import React from "react";
import TableFormImport from "../components/TableFormImport/TableFormImport";
import { useQuery } from "@apollo/react-hooks";
import { GET_PERSONS, GET_PERSONS_TYPES } from "../GraphQL/Queries";
import { ADD_PERSONS, DELETE_PERSONS, UPDATE_PERSONS } from "../GraphQL/Mutations";
import PersonIcon from "@material-ui/icons/Person";

const SetPersons = () => {
  const { loading, error, data } = useQuery(GET_PERSONS_TYPES);
  if (loading) return "Loading persons .....";
  if (error) return `Error! ${error.message}`;

  console.log(data);

  const columns = [
    {
      Header: "Действия",
      accessor: "actions",
      width: 85,
      sortable: false,
      filterable: false,
      show: false,
    },
    { Header: "id", accessor: "id", type: "integer", show: false, required: true },
    {
      Header: "Фамилия",
      accessor: "surname",
      type: "text",
      show: true,
      required: false,
      initialState: "",
    },
    { Header: "Имя", accessor: "name", type: "text", show: true, required: true, initialState: "" },
    {
      Header: "Отчество",
      accessor: "middle_name",
      type: "text",
      show: true,
      required: false,
      initialState: "",
    },
    {
      Header: "Имя в мейл",
      accessor: "name_in_mail",
      type: "text",
      show: true,
      required: true,
      initialState: "",
    },
    {
      Header: "Телефон",
      accessor: "phone",
      type: "text",
      show: true,
      required: false,
      initialState: "",
    },
    {
      Header: "Email",
      accessor: "email",
      type: "text",
      show: true,
      required: false,
      initialState: "",
    },
    {
      Header: "ДР",
      accessor: "birthday",
      type: "date",
      show: true,
      required: false,
      initialState: new Date(),
    },
    {
      Header: "Муж/Жен",
      accessor: "gender",
      type: "checkbox",
      show: true,
      required: true,
      initialState: true,
    },
    {
      Header: "Адрес",
      accessor: "address",
      type: "text",
      show: true,
      required: false,
      initialState: "",
    },
    {
      Header: "Тип контакта",
      accessor: "type_id",
      type: "select",
      show: true,
      required: false,
      selectorSetting: {
        arrData: data.type_person,
        inputLabelText: "Тип контакта",
        showInItem: ["description"],
      },
    },
  ];

  const crud = {
    create: ADD_PERSONS,
    read: GET_PERSONS,
    update: UPDATE_PERSONS,
    delete: DELETE_PERSONS,
  };

  const formHeader = {
    icon: <PersonIcon fontSize="large" />,
    text: "Контактные данные",
    buttonText: "Add person",
  };

  const tableName = "persons";

  return (
    <div>
      <TableFormImport
        columns={columns}
        crud={crud}
        tableName={tableName}
        formHeader={formHeader}
      />
    </div>
  );
};

export default SetPersons;
