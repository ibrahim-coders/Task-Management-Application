const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
// MongoDB URI
// const uri = mongodb+srv:${process.env.APP_NAME}:${process.env.SECRET_PASS}@cluster0.whh17.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0;

const uri = 'mongodb://localhost:27017/'; // বা MongoDB Atlas URI
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    await client.db('admin').command({ ping: 1 });

    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );

    const database = client.db('Task_Management');
    const userCollection = database.collection('users');

    app.post('/user/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email };
        const user = req.body;
        console.log('users', user);
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
    // Ensures the client is closed properly
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Task Management Application');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
