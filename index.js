const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

const app = express();
const port = process.env.PORT || 5001;

// Middlewares
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xeaidsx.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const serviceCollection = client.db("car-doctor").collection("services");

    app.get('/services', async(req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    })
    app.get('/services/:id', async(req, res) => {
      const filter = { service_id: req.params.id };
      const result = await serviceCollection.findOne(filter);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Connected !!!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("Welcome to Car Doctor's server !!!");
})
app.listen(port, () => {
  console.log(`Server is running on ${port} port !!!`);
})