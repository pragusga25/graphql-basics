import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
  type Query{
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    available: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    title() {
      return 'The Alchemist';
    },
    price() {
      return 10.89;
    },
    releaseYear() {
      return 2001;
    },
    rating() {
      return null;
    },
    available() {
      return true;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('The server is running'));
