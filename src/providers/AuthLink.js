import { setContext } from "apollo-link-context";

export const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-hasura-admin-secret": "PY9vNvuzdxrPAjSOoO8TLhjqvqiU2GbkQHqPvljqeL2GAgipDgkZb78hPdJXBg05",
    },
  };
});

// const token = ''; // accessToken;
// if (token) {
//     return {
//         headers: {
//             ...headers,
//             'x-hasura-admin-secret': 'PY9vNvuzdxrPAjSOoO8TLhjqvqiU2GbkQHqPvljqeL2GAgipDgkZb78hPdJXBg05'
//         }
//     };
// } else {
// return {
//     headers: {
//         ...headers,
//         'x-hasura-admin-secret': 'PY9vNvuzdxrPAjSOoO8TLhjqvqiU2GbkQHqPvljqeL2GAgipDgkZb78hPdJXBg05'
//     }
// }
// }
// }
