import { gql } from "apollo-boost";

export const ADD_ORDER = gql`
  mutation AddOrder($addData: orders_insert_input!) {
    insert_orders_one(object: $addData) {
      id
    }
  }
`;

export const ADD_ITEMS = gql`
  mutation AddItems($addData: items_insert_input!) {
    insert_items(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const UPSERT_ORDER = gql`
  mutation UpsertOrder($addData: orders_insert_input!) {
    insert_orders_one(
      object: $addData
      on_conflict: {
        constraint: orders_pkey
        update_columns: [
          date_out
          customer_id
          firm_id
          person_id
          shop_id
          our_firm_id
          delivery_id
          city
          packaging
          consignee_name
          consignee_phone
          consignee_data
          delivery_note
          price_type_id
          discount
          pay_till_date
          sum
          weigth
          note_order
          note_supplier
        ]
      }
    ) {
      id
    }
  }
`;

export const GET_ORDER_DATA = gql`
  query GetOrderData($order_id: Int!) {
    orders(where: { id: { _eq: $order_id } }) {
      id
      customer_id
      firm_id
      shop_id
      person_id
      our_firm_id
      note_order
      pay_till_date
      packaging
      date_out
      sum
      weigth
      discount
      price_type_id
      bill_id
      invoice_id
      city
      consignee_data
      consignee_name
      consignee_phone
      delivery_id
      customer {
        id
        name
        firms {
          id
          name
          inn
          kpp
          okpo
          ogrn
          contracts {
            our_firm_id
          }
        }
        shops {
          id
          name
          city
          address
          consignee_name
          consignee_phone
          consignee_data
          delivery_id
          delivery_note
        }
        persons {
          id
          full_name
          name
          surname
          phone
          email
          shop_id
          firm_id
        }
        saldo
        price_type_id
      }
      items {
        id
        item_id
        qty
        note
        price {
          art
          name
          price_dealer
          price_opt
          price_retail
          weight
        }
      }
    }
  }
`;


export const newOrderFormState = {
  customer_id: undefined,
  firm_id: undefined,
  shop_id: undefined,
  person_id: undefined,
  customer: { name: undefined },
  items: [],
  sum: 0,
  discount: 0,
  payment_term: "",
  packaging: "",
  price_type_id: 0,
  orderParams: {
    weight: 0,
    sum_opt: 0,
    sum_dealer: 0,
    sum_retail: 0,
  },
  city: "",
  address: "",
  consignee_name: "",
  consignee_phone: "",
  consignee_data: "",
  delivery_id: undefined,
  delivery_note: "",
}

export const SUBSCRIPTION_CUSTOMERS = gql`
  subscription SubscriptionsCustomers {
    customers(where: { id: { _gt: 10 } }) {
      id
      name
      discount
      saldo
      payment_term
      price_type_id
      shops {
        id
        name
        city
        address
        consignee_name
        consignee_phone
        consignee_data
        delivery_note
        delivery_id
      }
      firms {
        id
        name
        contracts {
          our_firm_id
        }
      }
      persons {
        id
        email
        full_name
        name
        surname
        phone
        firm_id
        shop_id
      }
    }
  }
`;


export const QUERY_OUR_FIRMS = gql`
  query QueryOurFirms {
    our_firms {
      id
      firm_id
      name
    }
  }
`;

export const QUERY_DELIVERY = gql`
  query QueryDelivery {
    delivery {
      id
      name
    }
  }
`;

export const columnsCustomers = [
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
    Header: "Название",
    accessor: "name",
    type: "text",
    show: true,
    required: true,
    initialState: "",
  },
  {
    Header: "Город",
    accessor: "town",
    type: "text",
    show: true,
    required: true,
    initialState: "",
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
    Header: "Контакт",
    accessor: "contact_id",
    type: "integer",
    show: true,
    required: false,
    initialState: undefined,
  },
  {
    Header: "Тэги",
    accessor: "tags",
    type: "text",
    show: true,
    required: true,
    initialState: "",
  },
  {
    Header: "Фирмы",
    accessor: "firms_ids",
    type: "text",
    show: true,
    required: false,
    initialState: "",
  },
  {
    Header: "Фирма",
    accessor: "firm_id",
    type: "integer",
    show: true,
    required: false,
    initialState: undefined,
  },
];
