import { GraphQLServer } from 'graphql-yoga';

// String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
  type Query{
    sayHi(name: String!, friendName: String): String!
    me: User!
    post: Post!
  }
  
  type User{
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post{
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    sayHi(parent, args, ctx, info) {
      if (args.name && args.friendName)
        return `Hi ${args.name} and ${args.friendName}`;
      else 'Hi everyone';
    },
    me() {
      return {
        id: 'us123',
        name: 'Taufik Pragusga',
        email: 'myemail@gmail.com',
      };
    },
    post() {
      return {
        id: 'po123',
        title: 'The Journey',
        body: 'The awesome journey',
        published: true,
      };
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('The server is running'));
