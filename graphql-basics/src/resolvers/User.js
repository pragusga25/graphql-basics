const User = {
  posts(parent, _, { db }) {
    return db.posts.filter((post) => post.authorId === parent.id);
  },
  comments(parent, _, { db }) {
    return db.comments.filter((comment) => comment.authorId === parent.id);
  },
};

export default User;
