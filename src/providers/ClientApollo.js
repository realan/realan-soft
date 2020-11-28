
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';

import initialState from '../GraphQL/state';
import { resolvers, typeDefs } from '../GraphQL/Resolvers';
import { authLink } from 'providers/AuthLink'

let cache = new InMemoryCache();

cache.writeData({
    data: initialState,
});

const httpLink = createHttpLink({
    uri: "https://realan.herokuapp.com/v1/graphql"
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
    connectToDevTools: true,
    typeDefs,
    resolvers,
});
