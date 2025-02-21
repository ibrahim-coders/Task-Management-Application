const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Server } = require('socket.io');
const { createServer } = require('http');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: ['http://localhost:5173'], credentials: true },
});

// MongoDB Connection

// const uri = mongodb+srv:${process.env.APP_NAME}:${process.env.SECRET_PASS}@cluster0.whh17.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0;
const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Connected to MongoDB!');

    const database = client.db('Task_Management');
    const userCollection = database.collection('users');
    const taksCollection = database.collection('taksboard');
    //post taks board
    app.post('/tasks', async (req, res) => {
      try {
        const newTask = req.body;
        console.log('taks', newTask);
        const result = await taksCollection.insertOne(newTask);
        io.emit('taskAdded', newTask);
        res.send(result);

        // Socket.IO Connection
        io.on('connection', socket => {
          console.log('A user connected:', socket.id);

          socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
          });
        });
      } catch (error) {
        console.log(error);
      }
    });
    //post the user
    app.post('/user/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email };
        const user = req.body;

        const isExist = await userCollection.findOne(query);
        if (isExist) {
          return res.status(200).send(isExist);
        }

        const result = await userCollection.insertOne({
          user,
          timestamp: Date.now(),
        });
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
  res.send('Task Management Application');
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
