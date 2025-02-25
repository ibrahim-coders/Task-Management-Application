require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { MongoClient, ServerApiVersion } = require('mongodb');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 3000;

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://messenger-lite-5829e.web.app'],
  })
);
app.use(express.json());
app.use(morgan('dev'));

const uri = `mongodb+srv:${process.env.APP_NAME}:${process.env.SECRET_PASS}@cluster0.whh17.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db('JobTask').collection('users');
    // Collection for tasks.
    const tasksCollection = client.db('JobTask').collection('tasks');

    app.post('users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get('users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
  } finally {
    // Optional: close client when needed.
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Socket.io integration ensuring tasks are user‑specific.
io.on('connection', async socket => {
  // Get the user's email from handshake auth.
  const userEmail = socket.handshake.auth.email;
  console.log('Client connected:', socket.id, 'User:', userEmail);
  // Join a room identified by the user’s email.
  socket.join(userEmail);

  const tasksCollection = client.db('JobTask').collection('tasks');

  // On connection, send tasks for this user.
  const tasks = await tasksCollection.find({ userEmail }).toArray();
  const groupedTasks = {
    todo: tasks.filter(task => task.status === 'todo'),
    inProgress: tasks.filter(task => task.status === 'inProgress'),
    done: tasks.filter(task => task.status === 'done'),
  };
  socket.emit('tasksUpdated', groupedTasks);

  // Listen for new tasks.
  socket.on('newTask', async task => {
    // Ensure task has the userEmail.
    task.userEmail = userEmail;
    await tasksCollection.insertOne(task);
    const tasks = await tasksCollection.find({ userEmail }).toArray();
    const groupedTasks = {
      todo: tasks.filter(task => task.status === 'todo'),
      inProgress: tasks.filter(task => task.status === 'inProgress'),
      done: tasks.filter(task => task.status === 'done'),
    };
    // Emit update only to this user.
    io.to(userEmail).emit('tasksUpdated', groupedTasks);
  });

  // Listen for task order updates.
  socket.on('updateTaskOrder', async data => {
    // Remove tasks only for this user.
    await tasksCollection.deleteMany({ userEmail });
    const allTasks = [];
    ['todo', 'inProgress', 'done'].forEach(status => {
      if (data[status]) {
        data[status].forEach(task => {
          allTasks.push({ ...task, status, userEmail });
        });
      }
    });
    if (allTasks.length > 0) {
      await tasksCollection.insertMany(allTasks);
    }
    const tasks = await tasksCollection.find({ userEmail }).toArray();
    const groupedTasks = {
      todo: tasks.filter(task => task.status === 'todo'),
      inProgress: tasks.filter(task => task.status === 'inProgress'),
      done: tasks.filter(task => task.status === 'done'),
    };
    io.to(userEmail).emit('tasksUpdated', groupedTasks);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
