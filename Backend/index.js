const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Server } = require('socket.io');
const { createServer } = require('http');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { title } = require('process');

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

// const uri = `mongodb+srv:${process.env.APP_NAME}:${process.env.SECRET_PASS}@cluster0.whh17.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );

    const database = client.db('Task_Management');
    const userCollection = database.collection('users');
    const tasksCollection = database.collection('taksboard');
    //update
    app.patch('/taskUpdated/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const taskUpdated = {
        $set: {
          title: req.body.title,
          description: req.body.description,
          status: 'To-Do',
          timestamp: new Date().toISOString(),
        },
      };
      console.log(taskUpdated);
      io.emit('taskUpdated', taskUpdated);

      const result = await tasksCollection.updateOne(query, taskUpdated);
      res.send(result);
    });
    // Change task status
    app.put('/statusChange/:status', async (req, res) => {
      const { status } = req.params;
      const { newStatus } = req.body;

      try {
        const updatedTask = await tasksCollection.updateOne(
          { status },
          { $set: { status: newStatus } }
        );
        io.emit('updatedTask', updatedTask);
        res.send(updatedTask);
      } catch (error) {
        console.log(error);
      }
    });

    // Real-time updates using Change Streams
    app.delete('/taksDelete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);
      io.emit('taskDeleted', id);
      res.send(result);
    });
    app.get('/displaytasks/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };

      const tasks = await tasksCollection.find(query).toArray();
      res.send(tasks);
    });
    //post taks board
    app.post('/tasks', async (req, res) => {
      try {
        const newTask = req.body;

        const result = await tasksCollection.insertOne(newTask);
        io.emit('taskAdded', newTask);
        res.send(result);

        // Socket.IO Connection
        // io.on('connection', socket => {
        //   console.log('A user connected:', socket.id);

        //   socket.on('disconnect', () => {
        //     console.log('User disconnected:', socket.id);
        //   });
        // });
      } catch (error) {
        console.log(error);
      }
    });
    app.patch('/uplodeImage/:email', async (req, res) => {
      const email = req.params.email;
      const { photoURL } = req.body;
      console.log('Received photoURL:', photoURL);

      try {
        // Find user by email to verify existence
        const user = await userCollection.findOne({ email: email });

        // if (!user) {
        //   return res.status(404).send({ message: 'User not found' });
        // }
        console.log(user);
        // Update the user's photoURL
        const updatedPhoto = await userCollection.updateOne(
          { email: email }, // Find the user by email
          { $set: { photoURL: photoURL } }
        );

        console.log('Update result:', updatedPhoto);

        if (updatedPhoto.modifiedCount > 0) {
          io.emit('updatedTask', updatedPhoto);
          res.send(updatedPhoto);
        } else {
          res.status(400).send({ message: 'No changes made' });
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error updating photoURL' });
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
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
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
