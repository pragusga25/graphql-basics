const users = [
  { id: '1', name: 'Taufik1', email: 'pou1@email.com', age: 19 },
  { id: '2', name: 'Taufik2', email: 'pou2@email.com' },
  { id: '3', name: 'Taufik3', email: 'pou3@email.com', age: 14 },
  { id: '4', name: 'Taufik4', email: 'pou4@email.com' },
];

const posts = [
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

const comments = [
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
    postId: '2',
  },
];

const db = {
  users,
  posts,
  comments,
};

export default db;
