import { gql } from "apollo-boost";

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
          provider_id
          is_on_sale
        ]
      }
    ) {
      returning {
        id
      }
    }
  }
`;
