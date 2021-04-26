import React from "react";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";

// for apollo client
const httpLink = createHttpLink({
  uri: "https://realan-suvenir.hasura.app/v1/graphql",
});
