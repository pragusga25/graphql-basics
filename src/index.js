import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
  type Query{
    name: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return `My name is Taufik Pragusga`;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('The server is running'));
