import React, { useState } from "react";
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import ApolloClient from 'apollo-boost';
// import { resolvers, typeDefs } from './Resolvers';
import initialState from "./state";

import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";

import { useAuth0 } from "./../../react-auth0-spa";
// import Loading from "./../components/Loading";

// const cache = new InMemoryCache()

// const client = new ApolloClient({
//   cache,
//   typeDefs,
//   resolvers,
// });

// for apollo client
const httpLink = createHttpLink({
  uri: "https://realan-suvenir.hasura.app/v1/graphql",
});

const [accessToken, setAccessToken] = useState("");

const { getTokenSilently, loading } = useAuth0();
if (loading) {
  return <Loading />; // "Loading..._______________";
}

// get access token
const getAccessToken = async () => {
  // getTokenSilently() returns a promise
  try {
    const token = await getTokenSilently();
    setAccessToken(token);
  } catch (e) {
    console.log("ошибка получения токена --", e);
  }
};
getAccessToken();

const authLink = setContext((_, { headers }) => {
  const token = accessToken;
  if (token) {
    return {
      headers: {
        ...headers,
        "x-hasura-admin-secret": "PY9vNvuzdxrPAjSOoO8TLhjqvqiU2GbkQHqPvljqeL2GAgipDgkZb78hPdJXBg05",
      },
    };
  } else {
    return {
      headers: {
        ...headers,
        "x-hasura-admin-secret": "PY9vNvuzdxrPAjSOoO8TLhjqvqiU2GbkQHqPvljqeL2GAgipDgkZb78hPdJXBg05",
      },
    };
  }

  // // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  // // return the headers to the context so httpLink can read them
  // return {

  //   headers: {
  //     ...headers,
  //     // 'x-hasura-admin-secret':'PY9vNvuzdxrPAjSOoO8TLhjqvqiU2GbkQHqPvljqeL2GAgipDgkZb78hPdJXBg05'

  //     // authorization: token ? `Bearer ${token}` : "",
  //     // if (token){
  //     //   'x-hasura-admin-secret':'PY9vNvuzdxrPAjSOoO8TLhjqvqiU2GbkQHqPvljqeL2GAgipDgkZb78hPdJXBg05'
  //     // }
  //   }
  // }
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  connectToDevTools: true,
  // typeDefs,
  // resolvers,
});

cache.writeData({
  data: initialState,
});

export default client;
