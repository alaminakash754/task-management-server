const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i6c2rzu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const taskCollection = client.db("taskDb").collection("userTask");

    app.post('/userTask', async (req, res) => {
      const taskItem = req.body;
      const result = await taskCollection.insertOne(taskItem);
      res.send(result);
    })

    app.get('/userTask', async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result)
    });

    app.get('/userTask/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      console.log(query)
      const result = await taskCollection.findOne(query);
      res.send(result);
    })

    app.put('/userTask/:id', async(req, res) => {
      const item = req.body;
      const id = req.params.id;
      const options = {upsert: true}
      const filter = {_id: new ObjectId(id)};
      const updatedTask = {
        $set: {
          title: item.title,
          description: item.description,
          deadline: item.deadline,
          priority: item.priority,
        }
      }
      const result = await taskCollection.updateOne(filter, updatedTask, options);
      res.send(result)
    })

    app.delete('/userTask/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      // console.log(query);
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Task Management is running')
})

app.listen(port, () => {
  console.log(`Task Management is running on port ${port}`)
})