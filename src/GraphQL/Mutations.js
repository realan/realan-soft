import gql from 'graphql-tag';

// Add Mutation - variable $addData for object

// mutations for mramolit project

export const ADD_CUSTOMER = gql`
  mutation AddCustomer($addData: mr_customer_insert_input!) {
    insert_mr_customer(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const ADD_CATEGORY = gql`
  mutation AddCategory($addData: mr_category_insert_input!) {
    insert_mr_category(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const ADD_PRICE = gql`
  mutation AddPrice($addData: mr_price_insert_input!) {
    insert_mr_price(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const ADD_ORDER = gql`
  mutation AddOrder($addData: mr_order_insert_input!) {
    insert_mr_order(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const ADD_ITEM = gql`
  mutation AddItem($addData: mr_items_insert_input!) {
    insert_mr_items(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const ADD_MOVING = gql`
  mutation AddMoving($addData: mr_moving_insert_input!) {
    insert_mr_moving(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const ADD_MOVE_ITEM = gql`
  mutation AddMove($addData: mr_moving_insert_input!) {
    insert_mr_moving(objects: [$addData]) {
      affected_rows
      returning {
        qty
        to_order
        from_order
        item
      }
    }
  }
`;

// old mutations

// DELIVERY

export const ADD_DELIVERY = gql`
  mutation AddDelivery($addData: delivery_insert_input!) {
    insert_delivery(objects: [$addData]) {
      affected_rows
      returning {
        id
        name
        address
        phone
        print_stickers
        site
        route_order
        contact_id
      }
    }
  }
`;

export const DELETE_DELIVERY = gql`
  mutation DeleteDelivery($id: Int!) {
    delete_delivery(where: { id: { _eq: $id } }) {
      returning {
        id
        name
        address
        phone
        print_stickers
        site
        route_order
        contact_id
      }
    }
  }
`;

export const UPDATE_DELIVERY = gql`
  mutation updateDelivery(
    $id: Int!
    $address: String
    $name: String!
    $phone: String
    $site: String
    $contact_id: Int
    $route_order: Int
    $print_stickers: Boolean
  ) {
    update_delivery(
      where: { id: { _eq: $id } }
      _set: {
        address: $address
        name: $name
        phone: $phone
        site: $site
        route_order: $route_order
        contact_id: $contact_id
        print_stickers: $print_stickers
      }
    ) {
      returning {
        id
        address
        name
        phone
        site
        route_order
        contact_id
        print_stickers
      }
    }
  }
`;

// PERSONS

export const ADD_PERSONS = gql`
  mutation AddPerson($addData: persons_insert_input!) {
    insert_persons(objects: [$addData]) {
      affected_rows
      returning {
        id
        surname
        name
        middle_name
        name_in_mail
        phone
        email
        birthday
        gender
        address
        type_id
      }
    }
  }
`;

export const DELETE_PERSONS = gql`
  mutation DeletePersons($id: Int!) {
    delete_persons(where: { id: { _eq: $id } }) {
      returning {
        id
        surname
        name
        middle_name
        name_in_mail
        phone
        email
        birthday
        gender
        address
        type_id
      }
    }
  }
`;

export const UPDATE_PERSONS = gql`
  mutation updatePersons(
    $id: Int!
    $surname: String
    $name: String!
    $middle_name: String
    $name_in_mail: String!
    $phone: String
    $email: String
    $birthday: timestamptz
    $gender: Boolean!
    $address: String
    $type_id: Int
  ) {
    update_persons(
      where: { id: { _eq: $id } }
      _set: {
        surname: $surname
        name: $name
        middle_name: $middle_name
        name_in_mail: $name_in_mail
        phone: $phone
        email: $email
        birthday: $birthday
        gender: $gender
        address: $address
        type_id: $type_id
      }
    ) {
      returning {
        id
        surname
        name
        middle_name
        name_in_mail
        phone
        email
        birthday
        gender
        address
        type_id
      }
    }
  }
`;

// FIRMS

export const ADD_FIRMS = gql`
  mutation AddFirms($addData: firms_insert_input!) {
    insert_firms(objects: [$addData]) {
      affected_rows
      returning {
        id
        name_short
        name_full
        address
        inn
        kpp
        okpo
        phone
        email
        site
        bank_data
        agreement_data
        tags
        type
        director_id
        discount
        our_firm_id
      }
    }
  }
`;

export const DELETE_FIRMS = gql`
  mutation DeleteFirms($id: Int!) {
    delete_firms(where: { id: { _eq: $id } }) {
      returning {
        id
        name_short
        name_full
        address
        inn
        kpp
        okpo
        phone
        email
        site
        bank_data
        agreement_data
        tags
        type
        director_id
        discount
        our_firm_id
      }
    }
  }
`;

export const UPDATE_FIRMS = gql`
  mutation updateFirms(
    $id: Int!
    $name_short: String!
    $name_full: String!
    $address: String
    $inn: numeric
    $kpp: numeric
    $okpo: numeric
    $phone: String
    $email: String
    $site: String
    $bank_data: String
    $agreement_data: String
    $tags: String
    $type: String
    $director_id: Int
    $discount: numeric!
    $our_firm_id: Int
  ) {
    update_firms(
      where: { id: { _eq: $id } }
      _set: {
        id: $id
        name_short: $name_short
        name_full: $name_full
        address: $address
        inn: $inn
        kpp: $kpp
        okpo: $okpo
        phone: $phone
        email: $email
        site: $site
        bank_data: $bank_data
        agreement_data: $agreement_data
        tags: $tags
        type: $type
        director_id: $director_id
        discount: $discount
        our_firm_id: $our_firm_id
      }
    ) {
      returning {
        id
        name_short
        name_full
        address
        inn
        kpp
        okpo
        phone
        email
        site
        bank_data
        agreement_data
        tags
        type
        director_id
        discount
        our_firm_id
      }
    }
  }
`;

// SHOPS

export const ADD_SHOPS = gql`
  mutation AddShops($addData: shops_insert_input!) {
    insert_shops(objects: [$addData]) {
      affected_rows
      returning {
        id
        name
        town
        address
        contact_id
        tags
        firms_ids
        firm_id
      }
    }
  }
`;

export const DELETE_SHOPS = gql`
  mutation DeleteShops($id: Int!) {
    delete_shops(where: { id: { _eq: $id } }) {
      returning {
        id
        name
        town
        address
        contact_id
        tags
        firms_ids
        firm_id
      }
    }
  }
`;

export const UPDATE_SHOPS = gql`
  mutation updateShops(
    $id: Int!
    $name: String!
    $town: String!
    $address: String
    $contact_id: Int
    $tags: String
    $firms_ids: int2vector
    $firm_id: Int
  ) {
    update_shops(
      where: { id: { _eq: $id } }
      _set: {
        id: $id
        name: $name
        town: $town
        address: $address
        contact_id: $contact_id
        tags: $tags
        firms_ids: $firms_ids
        firm_id: $firm_id
      }
    ) {
      returning {
        id
        name
        town
        address
        contact_id
        tags
        firms_ids
        firm_id
      }
    }
  }
`;

// ORDERS

export const ADD_ORDERS = gql`
  mutation AddOrders($addData: orders_insert_input!) {
    insert_orders(objects: [$addData]) {
      affected_rows
      returning {
        id
        date_in
        date_out
        town
        delivery
        customer_id
        customer_shop_id
        firm_id
        our_firm_id
        contact_person_id
        delivery_id
        packing_note
        consignee_firm_id
        consignee_person_id
      }
    }
  }
`;

export const DELETE_ORDERS = gql`
  mutation DeleteOrders($id: Int!) {
    delete_orders(where: { id: { _eq: $id } }) {
      returning {
        id
        date_in
        date_out
        town
        delivery
        customer_id
        customer_shop_id
        firm_id
        our_firm_id
        contact_person_id
        delivery_id
        packing_note
        consignee_firm_id
        consignee_person_id
      }
    }
  }
`;

export const UPDATE_ORDERS = gql`
  mutation updateOrders(
    $id: Int!
    $date_in: timestamptz
    $date_out: timestamptz!
    $town: String!
    $delivery: String
    $customer_id: Int
    $customer_shop_id: Int
    $firm_id: Int
    $our_firm_id: Int
    $contact_person_id: Int
    $delivery_id: Int
    $packing_note: String
    $consignee_firm_id: Int
    $consignee_person_id: Int
  ) {
    update_orders(
      where: { id: { _eq: $id } }
      _set: {
        id: $id
        date_in: $date_in
        date_out: $date_out
        town: $town
        delivery: $delivery
        customer_id: $customer_id
        customer_shop_id: $customer_shop_id
        firm_id: $firm_id
        our_firm_id: $our_firm_id
        contact_person_id: $contact_person_id
        delivery_id: $delivery_id
        packing_note: $packing_note
        consignee_firm_id: $consignee_firm_id
        consignee_person_id: $consignee_person_id
      }
    ) {
      returning {
        id
        date_in
        date_out
        town
        delivery
        customer_id
        customer_shop_id
        firm_id
        our_firm_id
        contact_person_id
        delivery_id
        packing_note
        consignee_firm_id
        consignee_person_id
      }
    }
  }
`;
