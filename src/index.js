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
  {
    id: 'c1',
    text: 'That is cool book',
    authorId: 'pou102944',
    postId: 'dapwo123',
  },
  {
    id: 'c2',
    text: 'That is bad book',
    authorId: 'pou102944',
    postId: 'po123',
  },
  {
    id: 'c3',
    text: 'That is horrible book',
    authorId: 'pou1021219',
    postId: 'poda2123',
  },
  {
    id: 'c4',
    text: 'That is awesome book',
    authorId: 'pou102139',
    postId: 'dapwo123',
  },
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
    comments: [Comment!]!
  }

  type Post{
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment{
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    comments(parent) {
      return comments.filter((comment) => comment.postId === parent.id);
    },
  },
  User: {
    posts(parent) {
      return posts.filter((post) => post.authorId === parent.id);
    },
    comments(parent) {
      return comments.filter((comment) => comment.authorId === parent.id);
    },
  },
  Comment: {
    author(parent) {
      return users.find((user) => user.id === parent.authorId);
    },
    post(parent) {
      return posts.find((post) => post.id === parent.postId);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('The server is running'));
