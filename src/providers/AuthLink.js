import { setContext } from "apollo-link-context";

export const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-hasura-admin-secret": "31080913",
    },
  };
});

// const token = ''; // accessToken;
// if (token) {
//     return {
//         headers: {
//             ...headers,
//             'x-hasura-admin-secret': '31080913'
//         }
//     };
// } else {
// return {
//     headers: {
//         ...headers,
//         'x-hasura-admin-secret': '31080913'
//     }
// }
// }
// }
