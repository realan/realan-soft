import React from "react";
import FormTemplate from "forms/FormTemplate";
import ReactTable from "../components/ReactTable/ReactTable";
import FileLoader from "../components/FileLoader/FileLoader";
import Button from "components/CustomButtons/Button.js";
import Close from "@material-ui/icons/Close";
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
// import ToggleTheme from "./ToggleTheme";

// import { Row, Col } from "reactstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import contentData from "../utils/contentData";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_DELIVERY } from "../GraphQL/Queries";
import {
  ADD_DELIVERY,
  DELETE_DELIVERY,
  UPDATE_DELIVERY,
} from "../GraphQL/Mutations";


const Orders = () => {
  let getSelectorData = () => { }

  const columns = React.useMemo(
    () => [
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
        Header: "Порядок заезда", // to input label too
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
          getSData: getSelectorData,
          inputLabelText: "Контакт",
          showInItem: ["name"], //какие значения показывать в selector item 
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
    ], []
  );

  // graphql chapter
  const addMutation = ADD_DELIVERY;
  const deleteMutation = DELETE_DELIVERY;
  const updateMutation = UPDATE_DELIVERY;
  const getDataQuery = GET_DELIVERY;
  const tableName = "delivery";

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
  const [DeleteDelivery] = useMutation(deleteMutation, { update: updateCacheDelete });

  const { loading, error, data } = useQuery(getDataQuery);
  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const addInitialState = {}
  columns.forEach(item => item.initialState !== undefined ? addInitialState[item.accessor] = item.initialState : "" );

  // Handlers
  const addHandler = (data) => {
    AddMutation({ variables: data });
  }
  const updateHandler = (data) => {
    UpdateMutation({ variables: data });
  }
  const deleteItem = (id) => {
    // console.log(id)
    DeleteDelivery({ variables: { id: id } })
  }

  const formHeader = {
    icon: <LocalShippingIcon fontSize="large" />,
    text: "Sample Input",
    buttonText: "Add Sample",
  }

  const getInitialState = (id) => {
    let state = data[tableName].filter(item => {
      return item.id === id
    })[0];
    return state;
  }

  const tableData = data[tableName].map(item => {
    return {
      actions: (
        <div className="actions-right" style={{ display: "inline-flex", padding: "2px" }}>
          {/* use this button to add a edit kind of action */}
          <FormTemplate
            key={item.id}
            fields={columns}
            initialState={getInitialState(item.id)}
            header={formHeader}
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

  return (
    <div>
      <FormTemplate 
        fields={columns} 
        initialState={addInitialState} 
        header={formHeader} 
        openIcon={<AddIcon />}
        onSubmit={addHandler}
      />
      <ReactTable columns={columns} data={tableData} />
      <FileLoader header={columns} handler={addHandler} />
    </div>
  )
}

export default Orders;
