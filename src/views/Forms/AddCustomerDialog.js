import React from "react";
import { gql } from "apollo-boost";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import FormTemplate from "components/FormTemplate/FormTemplate";
import ConfirmSnackbar from "components/ConfirmSnackbar/ConfirmSnackbar";
import { dataStructureTest } from "constants/dataStructureTest;

const ADD_CUSTOMER = gql`
  mutation AddCustomerMutation($addData: customers_insert_input!) {
    insert_customers(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;


{ name: "text" },
{ discount: "number" },
{ date_start: "text" },
{ type: "text" },
{ tags: "text" },
{ dealer: "text" },
{ saldo: "number" },
{ payment_term: "text" },
{ price_type_id: "number" },

const inputFieldValues = [
    {
      name: "name",
      label: "Заказчик",
      type: "text",
      id: "cust-name"
    },
    {
        name: "type",
        label: "Описание",
        id: "cust-type",
      },
    {
      name: "discount",
      label: "Скидка",
      id: "cust-discount"
    },
    {
      name: "saldo",
      label: "Начальное сальдо",
      id: "cust-saldo",
    },
    {
      name: "price_type_id",
      label: "Тип цены",
      id: "price-type",
    },
    {
      name: "payment_term",
      label: "Условия оплаты",
      id: "payment-term",
    },
  ];
const fields = [
    {
      Header: "id", // to input label too
      accessor: "id",
      type: "integer",
      required: true,
      show: false,
    },
    {
      Header: "Заказчик",
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


const AddCustomerDialog = () => {
  //   const [open, setOpen] = useState(false);
  const [state, setState] = useState([
    { name: "text" },
    { discount: "number" },
    { date_start: "text" },
    { type: "text" },
    { tags: "text" },
    { dealer: "text" },
    { saldo: "number" },
    { payment_term: "text" },
    { price_type_id: "number" },
  ]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [AddCustomerMutation, { data, loading, error }] = useMutation(ADD_CUSTOMER);

  setState(dataStructure.customers);

  useEffect(() => {
    if (data) {
      setOpenConfirm(true);
    }
  }, [data]);

  if (loading) return "Adding Customer....";
  if (error) return `Error! ${error.message}`;

  const handleCancel = () => {
    // setOpen(false);
  };
  const handleSubmit = () => {
      const addData = state.map(item => {
          let obj = {
              item.
          }
          return obj
      })
    AddCustomerMutation();
    // setOpen(false);
  };
  const handleChange = (type, value) => {
    setState((prevState) => ({ ...prevstate, [type]: value }));
  };

  return (
    <>
        <form>

        </form>
      <FormTemplate
        title={"Добавить заказчика"}
        fields={state}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel} //headerIcon, headerText, buttonText, onSubmit, fields
      />
      <ConfirmSnackbar
        open={openConfirm}
        message={"Добавил заказчика"}
        onClose={() => setOpenConfirm(false)} //() => setOpenConfirm(false)}
      />
    </>
  );
};

export default AddCustomerDialog;
