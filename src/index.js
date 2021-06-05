import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';

// Resolvers
const resolvers = {
  Query: {
    users(_, args, { db }) {
      if (!args.query) return db.users;

      return db.users.filter(
        (user) => user.name.toLowerCase() === args.query.toLowerCase()
      );
    },
    posts(_, args, { db }) {
      if (!args.query) return db.posts;

      return db.posts.filter((post) => {
        const input = args.query.toLowerCase();

        const isTitleMatch = post.title.toLowerCase().includes(input);
        const isBodyMatch = post.body.toLowerCase().includes(input);

        return isTitleMatch || isBodyMatch;
      });
    },
    comments(_, _args, { db }) {
      return db.comments;
    },
  },

  Mutation: {
    createUser(_, args, { db }) {
      const emailTaken = db.users.some(
        (user) => user.email === args.data.email
      );
      if (emailTaken) throw new Error('Email taken');

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      db.users.push(user);

      return user;
    },

    createPost(_, args, { db }) {
      const userExists = db.users.some(
        (user) => user.id === args.data.authorId
      );

      if (!userExists) throw new Error('User not found');

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      db.posts.push(post);

      return post;
    },

    createComment(_, args, { db }) {
      const userExists = db.users.some(
        (user) => user.id === args.data.authorId
      );
      const postExists = db.posts.some(
        (post) => post.id === args.data.postId && post.published
      );

      if (!userExists || !postExists)
        throw new Error('Unable to find user and post');

      const comment = {
        id: uuidv4(),
        ...args.data,
      };

      db.comments.push(comment);

      return comment;
    },

    deletePost(_, args, { db }) {
      const postIndex = db.posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) throw new Error('Post not found');

      const deletedPost = db.posts.splice(postIndex, 1);

      db.comments = db.comments.filter((comment) => comment.postId !== args.id);

      return deletedPost[0];
    },

    deleteUser(_, args, { db }) {
      const userIndex = db.users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) throw new Error('User not found');

      const deletedUser = db.users.splice(userIndex, 1);

      db.posts = db.posts.filter((post) => {
        const match = post.authorId === args.id;

        if (match) {
          db.comments = db.comments.filter(
            (comment) => comment.postId !== post.id
          );
        }

        db.comments = db.comments.filter(
          (comment) => comment.authorId !== args.id
        );

        return !match;
      });

      return deletedUser[0];
    },

    deleteComment(_, args, { db }) {
      const commentIndex = db.comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) throw new Error('Comment not found');

      const deletedComment = db.comments.splice(commentIndex, 1);

      return deletedComment[0];
    },
  },

  Post: {
    author(parent, _, { db }) {
      return db.users.find((user) => user.id === parent.authorId);
    },
    comments(parent, _, { db }) {
      return db.comments.filter((comment) => comment.postId === parent.id);
    },
  },
  User: {
    posts(parent, _, { db }) {
      return db.posts.filter((post) => post.authorId === parent.id);
    },
    comments(parent, _, { db }) {
      return db.comments.filter((comment) => comment.authorId === parent.id);
    },
  },
  Comment: {
    author(parent, _, { db }) {
      return db.users.find((user) => user.id === parent.authorId);
    },
    post(parent, _, { db }) {
      return db.posts.find((post) => post.id === parent.postId);
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql', // root directory
  resolvers,
  context: {
    db,
  },
});

server.start(() => console.log('The server is running'));
