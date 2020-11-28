import gql from "graphql-tag";


export const GET_DELIVERY = gql`{
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
}`;

export const getLocalDelivery = gql`{
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
}`;