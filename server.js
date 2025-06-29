const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Enable CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get('/comments', (req, res) => {
  const db = router.db;
  res.json(db.get('comments').value());
});

server.post('/comments', (req, res) => {
  const db = router.db;
  const comment = req.body;
  
  if (!comment.id) {
    comment.id = Date.now();
  }
  
  db.get('comments').push(comment).write();
  res.status(201).json(comment);
});

server.get('/stats/:username', (req, res) => {
  const db = router.db;
  const username = req.params.username;
  
  const userPosts = db.get('posts').filter(post => post.username === username).value();
  const postCount = userPosts.length;
  
  let followerCount = 0;
  const allUsers = db.get('users').value();
  
  allUsers.forEach(user => {
    if (user.following && user.following.includes(username)) {
      followerCount++;
    }
  });
  
  const userRecord = db.get('users').find({ username }).value();
  const followingCount = userRecord?.following?.length || 0;

  res.json({
    username,
    postCount,
    followers: followerCount,
    following: followingCount
  });
});


server.get('/followers/:username', (req, res) => {
  const db = router.db;
  const username = req.params.username;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  let followerCount = 0;
  const allUsers = db.get('users').value();
  
  allUsers.forEach(user => {
    if (user.following && user.following.includes(username)) {
      followerCount++;
    }
  });
  
  res.json(followerCount);
});

server.use(router);

const port = 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});