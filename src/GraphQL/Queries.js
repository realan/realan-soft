import gql from "graphql-tag";

// querries for mramolit project
export const GET_PRICE = gql`
  query GetPrice {
    price {
      id
      art
      category_id
      name
      price_dealer
      price_opt
      price_retail
      weight
      supplier {
        id
        our_discount
      }
    }
  }
`;

// export const GET_PRICE_NEW = gql`
//   query GetPrice {
//     price {
//       id
//       name
//       art
//       price_dealer
//       price_opt
//       price_retail
//       weight
//     }
//   }
// `;

/// old querries

export const GET_DELIVERY = gql`
  {
    delivery {
      id
      name
      address
      contact_id
      phone
      print_stickers
      route_order
      site
    }
  }
`;

export const GET_PERSONS = gql`
  {
    persons {
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
`;

export const GET_FIRMS = gql`
  {
    firms {
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
`;

export const GET_SHOPS = gql`
  {
    shops {
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
`;

export const GET_ORDERS = gql`
  {
    orders {
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
`;

export const GET_PERSONS_BY_TYPE = gql`
  query GetPersonsByType($typeId: Int) {
    persons(where: { type_id: { _eq: $typeId } }) {
      id
      surname
      name
      phone
    }
  }
`;

export const GET_PERSONS_TYPES = gql`
  {
    type_person {
      type
      id
      description
    }
  }
`;
