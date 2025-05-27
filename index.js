const express = require('express')
const app = express()
require('dotenv').config()
const cors =require('cors')
const port =process.env.PORT || 3000


app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jogbo5m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

 const jobCollection = client.db('job_portal').collection('jobs');
 const applitionCollection = client.db('job_portal').collection('aplition');

app.get('/jobs', async (req, res) => {
  const result = await jobCollection.find().toArray(); // ✅ Correct use of .toArray()
  res.send(result);
});

app.get('/jobs/:id',async(req,res)=>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await jobCollection.findOne(query);
  res.send(result);
})

app.post('/applitions',async(req,res)=>{
  const applition = req.body;
  const result=await applitionCollection.insertOne(applition);
  res.send(result);
  
})
app.get('/applitions', async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).send({ error: "Email query is required" });
  }

  const query = { email: email };

  try {
    const result = await applitionCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Something went wrong' });
  }
});




 
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('job porta  data is comming!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
