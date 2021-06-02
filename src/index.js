import { GraphQLServer } from 'graphql-yoga';

// String, Boolean, Int, Float, ID

// Type definitions (schema)
const users = [
  { id: 'pou1021219', name: 'Taufik1', email: 'pou1@email.com', age: 19 },
  { id: 'pou102139', name: 'Taufik2', email: 'pou2@email.com' },
  { id: 'pou102119', name: 'Taufik3', email: 'pou3@email.com', age: 14 },
  { id: 'pou102944', name: 'Taufik4', email: 'pou4@email.com' },
];

const posts = [
  {
    id: 'po123',
    title: 'The Journey',
    body: 'The awesome journey',
    published: true,
  },
  {
    id: 'poda2123',
    title: 'The Coolest',
    body: 'So Cool',
    published: false,
  },
  {
    id: 'po12d2a3',
    title: 'The Cules',
    body: 'An idiot',
    published: false,
  },
  {
    id: 'dapwo123',
    title: 'The Alchemist',
    body: 'The fabel',
    published: true,
  },
];

const typeDefs = `
  type Query{
    users(query: String): [User!]!
    posts(query: String): [Post!]!
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
    users(parents, args, ctx, info) {
      if (!args.query) return users;

      return users.filter(
        (user) => user.name.toLowerCase() === args.query.toLowerCase()
      );
    },
    posts(parents, args, ctx, info) {
      if (!args.query) return posts;

      return posts.filter((post) => {
        const input = args.query.toLowerCase();

        const isTitleMatch = post.title.toLowerCase().includes(input);
        const isBodyMatch = post.body.toLowerCase().includes(input);

        return isTitleMatch || isBodyMatch;
      });
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('The server is running'));
