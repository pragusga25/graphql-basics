import { v4 as uuidv4 } from 'uuid';

const Mutation = {
  createUser(_, args, { db }) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);
    if (emailTaken) throw new Error('Email taken');

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(user);

    return user;
  },

  createPost(_, args, { db }) {
    const userExists = db.users.some((user) => user.id === args.data.authorId);

    if (!userExists) throw new Error('User not found');

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);

    return post;
  },

  createComment(_, args, { db }) {
    const userExists = db.users.some((user) => user.id === args.data.authorId);
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

  updateUser(_, { id, data }, { db }) {
    const user = db.users.find((user) => user.id === id);

    if (!user) throw new Error('User not found');

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) throw new Error('Email taken');

      user.email = data.email;
    }

    if (typeof data.name === 'string') user.name = data.name;

    if (typeof data.age === 'undefined') user.age = data.age;

    return user;
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
};

export default Mutation;
