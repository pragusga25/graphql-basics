import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';

// String, Boolean, Int, Float, ID

// Type definitions (schema)
let users = [
  { id: '1', name: 'Taufik1', email: 'pou1@email.com', age: 19 },
  { id: '2', name: 'Taufik2', email: 'pou2@email.com' },
  { id: '3', name: 'Taufik3', email: 'pou3@email.com', age: 14 },
  { id: '4', name: 'Taufik4', email: 'pou4@email.com' },
];

let posts = [
  {
    id: '1',
    title: 'The Journey',
    body: 'The awesome journey',
    published: true,
    authorId: '1',
  },
  {
    id: '2',
    title: 'The Coolest',
    body: 'So Cool',
    published: false,
    authorId: '1',
  },
  {
    id: '3',
    title: 'The Cules',
    body: 'An idiot',
    published: false,
    authorId: '2',
  },
  {
    id: '4',
    title: 'The Alchemist',
    body: 'The fabel',
    published: true,
    authorId: '3',
  },
];

let comments = [
  {
    id: '1',
    text: 'That is cool book',
    authorId: '1',
    postId: '1',
  },
  {
    id: '2',
    text: 'That is bad book',
    authorId: '1',
    postId: '2',
  },
  {
    id: '3',
    text: 'That is horrible book',
    authorId: '1',
    postId: '2',
  },
  {
    id: '4',
    text: 'That is awesome book',
    authorId: '3',
    postId: '1',
  },
];

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

  Mutation: {
    createUser(_, args) {
      const emailTaken = users.some((user) => user.email === args.data.email);
      if (emailTaken) throw new Error('Email taken');

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);

      return user;
    },

    createPost(_, args) {
      const userExists = users.some((user) => user.id === args.data.authorId);

      if (!userExists) throw new Error('User not found');

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      posts.push(post);

      return post;
    },

    createComment(_, args) {
      const userExists = users.some((user) => user.id === args.data.authorId);
      const postExists = posts.some(
        (post) => post.id === args.data.postId && post.published
      );

      if (!userExists || !postExists)
        throw new Error('Unable to find user and post');

      const comment = {
        id: uuidv4(),
        ...args.data,
      };

      comments.push(comment);

      return comment;
    },

    deletePost(_, args) {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) throw new Error('Post not found');

      const deletedPost = posts.splice(postIndex, 1);

      comments = comments.filter((comment) => comment.postId !== args.id);

      return deletedPost[0];
    },

    deleteUser(_, args) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) throw new Error('User not found');

      const deletedUser = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.authorId === args.id;

        if (match) {
          comments = comments.filter((comment) => comment.postId !== post.id);
        }

        comments = comments.filter((comment) => comment.authorId !== args.id);

        return !match;
      });

      return deletedUser[0];
    },

    deleteComment(_, args) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) throw new Error('Comment not found');

      const deletedComment = comments.splice(commentIndex, 1);

      return deletedComment[0];
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

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql', // root directory
  resolvers,
});

server.start(() => console.log('The server is running'));
