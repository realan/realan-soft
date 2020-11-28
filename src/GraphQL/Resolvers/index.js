import gql from 'graphql-tag';
// import { CounterMutation } from '../Mutations/counterMutation';
// import TodoMutations from '../Mutations/todosMutation';

export const typeDefs = gql`
  extend type Query {
    count: Number!,
    name:String!,
  }
`;

export const resolvers = {
  Mutation: {

  }
}