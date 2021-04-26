import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { ApolloClient } from "apollo-client";
import { getMainDefinition } from "@apollo/client/utilities";
import { split } from "@apollo/client";
import initialState from "../GraphQL/state";
import { resolvers, typeDefs } from "../GraphQL/Resolvers";
import { authLink } from "providers/AuthLink";

let cache = new InMemoryCache();

cache.writeData({
  data: initialState,
});

const httpLink = createHttpLink({
  uri: "https://realan-suvenir.hasura.app/v1/graphql",
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: "wss://realan-suvenir.hasura.app/v1/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        "x-hasura-admin-secret": "PY9vNvuzdxrPAjSOoO8TLhjqvqiU2GbkQHqPvljqeL2GAgipDgkZb78hPdJXBg05",
      },
    },
    //   connectionParams: {
    //     headers: {headers-object}
    //   }
  },
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache,
  connectToDevTools: true,
  typeDefs,
  resolvers,
});
