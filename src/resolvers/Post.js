const Post = {
  author(parent, _, { db }) {
    return db.users.find((user) => user.id === parent.authorId);
  },
  comments(parent, _, { db }) {
    return db.comments.filter((comment) => comment.postId === parent.id);
  },
};

export default Post;
