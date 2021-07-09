import { setContext } from "apollo-link-context";

export const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-hasura-admin-secret": "7Nm8QVTUxGdRalWbZzDnHDy4ZiByKk32I5O6FVDV3LJfQys7t2WRu3qPHMW70olV",
    },
  };
});

// const token = ''; // accessToken;
// if (token) {
//     return {
//         headers: {
//             ...headers,
//             'x-hasura-admin-secret': '7Nm8QVTUxGdRalWbZzDnHDy4ZiByKk32I5O6FVDV3LJfQys7t2WRu3qPHMW70olV'
//         }
//     };
// } else {
// return {
//     headers: {
//         ...headers,
//         'x-hasura-admin-secret': '7Nm8QVTUxGdRalWbZzDnHDy4ZiByKk32I5O6FVDV3LJfQys7t2WRu3qPHMW70olV'
//     }
// }
// }
// }
