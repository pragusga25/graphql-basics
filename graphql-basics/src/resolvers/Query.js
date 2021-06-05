const Query = {
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
};

export default Query;
