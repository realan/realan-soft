import gql from "graphql-tag";

export const SUBSCRIPTION_CUSTOMERS = gql`
    subscription {
        customers(where: {id: {_gt: 10}}) {
            id
            name
            dealer
            saldo
            firms {
                id
                name
            }
            shops {
                id
                city
                name
            }
            persons {
                id
                full_name
                phone
                email
                firm_id
                shop_id
            }
        }
    }
`;