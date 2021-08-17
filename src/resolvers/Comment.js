const Comment = {
  author(parent, _, { db }) {
    return db.users.find(user => user.id === parent.authorId);
  },
  post(parent, _, { db }) {
    return db.posts.find(post => post.id === parent.postId);
  },
};
export default Comment;
