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
    authorId: 'pou1021219',
  },
  {
    id: 'poda2123',
    title: 'The Coolest',
    body: 'So Cool',
    published: false,
    authorId: 'pou1021219',
  },
  {
    id: 'po12d2a3',
    title: 'The Cules',
    body: 'An idiot',
    published: false,
    authorId: 'pou102119',
  },
  {
    id: 'dapwo123',
    title: 'The Alchemist',
    body: 'The fabel',
    published: true,
    authorId: 'pou102944',
  },
];

const comments = [
  { id: 'c1', text: 'That is cool book' },
  { id: 'c2', text: 'That is bad book' },
  { id: 'c3', text: 'That is horrible book' },
  { id: 'c4', text: 'That is awesome book' },
];

const typeDefs = `
  type Query{
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]
  }
  
  type User{
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }

  type Post{
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }

  type Comment{
    id: ID!
    text: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(_, args) {
      if (!args.query) return users;

      return users.filter(
        (user) => user.name.toLowerCase() === args.query.toLowerCase()
      );
    },
    posts(_, args) {
      if (!args.query) return posts;

      return posts.filter((post) => {
        const input = args.query.toLowerCase();

        const isTitleMatch = post.title.toLowerCase().includes(input);
        const isBodyMatch = post.body.toLowerCase().includes(input);

        return isTitleMatch || isBodyMatch;
      });
    },
    comments() {
      return comments;
    },
  },
  Post: {
    author(parent) {
      return users.find((user) => user.id === parent.authorId);
    },
  },
  User: {
    posts(parent) {
      return posts.filter((post) => post.authorId === parent.id);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('The server is running'));
