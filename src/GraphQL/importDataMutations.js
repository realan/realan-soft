import { gql } from "apollo-boost";
// import { useMutation } from "@apollo/react-hooks";

// export const UpsertMutations = () => {
//   const [UpsertCategory] = useMutation(UPSERT_CATEGORY);
//   const [UpsertCustomers] = useMutation(UPSERT_CUSTOMERS);
//   const [UpsertDocuments] = useMutation(UPSERT_DOCUMENTS);
//   const [UpsertFirms] = useMutation(UPSERT_FIRMS);
//   const [UpsertItems] = useMutation(UPSERT_ITEMS);
//   const [UpsertMoves] = useMutation(UPSERT_MOVES);
//   const [UpsertOrders] = useMutation(UPSERT_ORDERS);
//   const [UpsertPersons] = useMutation(UPSERT_PERSONS);
//   const [UpsertPrice] = useMutation(UPSERT_PRICE);
//   const [UpsertShops] = useMutation(UPSERT_SHOPS);

//   const mutations = {};
//   mutations["category"] = UpsertCategory;
//   mutations["customers"] = UpsertCustomers;
//   mutations["documents"] = UpsertDocuments;
//   mutations["firms"] = UpsertFirms;
//   mutations["items"] = UpsertItems;
//   mutations["moves"] = UpsertMoves;
//   mutations["orders"] = UpsertOrders;
//   mutations["persons"] = UpsertPersons;
//   mutations["price"] = UpsertPrice;
//   mutations["shops"] = UpsertShops;

//   return mutations;
// };

export const UPSERT_CATEGORY = gql`
  mutation UpsertCategory($addData: [category_insert_input!]!) {
    insert_category(
      objects: $addData
      on_conflict: { constraint: category_pkey, update_columns: [name] }
    ) {
      returning {
        id
        name
      }
    }
  }
`;
export const UPSERT_CONTRACTS = gql`
  mutation UpsertContracts($addData: [contracts_insert_input!]!) {
    insert_contracts(
      objects: $addData
      on_conflict: {
        constraint: contracts_pkey
        update_columns: [firm_id, our_firm_id, date_start, date_end, contract_no, is_valid]
      }
    ) {
      returning {
        id
      }
    }
  }
`;

export const UPSERT_CUSTOMERS = gql`
  mutation UpsertCustomers($addData: [customers_insert_input!]!) {
    insert_customers(
      objects: $addData
      on_conflict: {
        constraint: customers_pkey
        update_columns: [
          name
          discount
          date_start
          type
          tags
          dealer
          saldo
          payment_term
          price_type_id
        ]
      }
    ) {
      returning {
        id
        name
      }
    }
  }
`;

export const UPSERT_DOCUMENTS = gql`
  mutation UpsertDocuments($addData: [documents_insert_input!]!) {
    insert_documents(
      objects: $addData
      on_conflict: {
        constraint: registr_pkey
        update_columns: [
          date
          sum
          sum_net
          customer_id
          firm_id
          shop_id
          order_id
          our_firm_id
          type_doc_id
          number
          year
        ]
      }
    ) {
      returning {
        id
        our_firm_id
        number
        year
      }
    }
  }
`;

export const UPSERT_FIRMS = gql`
  mutation UpsertFirms($addData: [firms_insert_input!]!) {
    insert_firms(
      objects: $addData
      on_conflict: {
        constraint: firms_pkey
        update_columns: [
          name
          customer_id
          address
          inn
          kpp
          ogrn
          okpo
          address_mail
          email
          site
          phone
          management_name
          management_post
          bank
          bic
          account
          corr_account
          accountant_name
        ]
      }
    ) {
      returning {
        id
        name
      }
    }
  }
`;

export const UPSERT_ITEMS = gql`
  mutation UpsertItems($addData: [items_insert_input!]!) {
    insert_items(
      objects: $addData
      on_conflict: {
        constraint: items_pkey
        update_columns: [item_id, qty, order_id, note, is_cancelled]
      }
    ) {
      returning {
        id
        item_id
        order_id
      }
    }
  }
`;

export const UPSERT_MOVES = gql`
  mutation UpsertMoves($addData: [moves_insert_input!]!) {
    insert_moves(
      objects: $addData
      on_conflict: {
        constraint: moves_pkey
        update_columns: [item_id, qty, from_order, to_order, created_at]
      }
    ) {
      returning {
        id
        item_id
        from_order
        to_order
      }
    }
  }
`;

export const UPSERT_ORDERS = gql`
  mutation UpsertOrders($addData: [orders_insert_input!]!) {
    insert_orders(
      objects: $addData
      on_conflict: {
        constraint: orders_pkey
        update_columns: [
          date_in
          date_out
          customer_id
          firm_id
          person_id
          shop_id
          bill_id
          invoice_id
          our_firm_id
          delivery_id
          packaging
          consignee_name
          price_type_id
          discount
          pay_till_date
          payment_status
          sum
          weight
          is_shipped
          note_order
          note_supplier
          delivery_note
          city
          consignee_data
          is_cancelled
          payment_ratio
          consignee_phone
          address
          waybill_number
        ]
      }
    ) {
      returning {
        id
        date_out
        customer_id
      }
    }
  }
`;

export const UPSERT_PERSONS = gql`
  mutation UpsertPersons($addData: [persons_insert_input!]!) {
    insert_persons(
      objects: $addData
      on_conflict: {
        constraint: persons_pkey
        update_columns: [
          full_name
          name
          gender
          birthday
          phone
          email
          passport
          customer_id
          firm_id
          shop_id
          surname
          fio
          note
        ]
      }
    ) {
      returning {
        id
        name
      }
    }
  }
`;

export const UPSERT_PRICE = gql`
  mutation UpsertPrice($addData: [price_insert_input!]!) {
    insert_price(
      objects: $addData
      on_conflict: {
        constraint: price_art_key
        update_columns: [
          name
          name_voice
          art
          category_id
          price_dealer
          price_opt
          price_retail
          height
          weight
          consist_of_ids
          supplier_id
          is_on_sale
        ]
      }
    ) {
      returning {
        id
        name
      }
    }
  }
`;

export const UPSERT_SHOPS = gql`
  mutation UpsertShops($addData: [shops_insert_input!]!) {
    insert_shops(
      objects: $addData
      on_conflict: {
        constraint: shops_pkey
        update_columns: [
          name
          city
          address
          customer_id
          email
          consignee_name
          consignee_phone
          consignee_data
          delivery_note
          delivery_id
          delivery_ask
        ]
      }
    ) {
      returning {
        id
        name
      }
    }
  }
`;
