const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gvjclco.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productsCollection = client.db("ema-jhon").collection("products");

    app.get("/products", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      const query = {};
      const cursor = productsCollection.find(query);
      const count = await productsCollection.estimatedDocumentCount();
      const products = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send({ count, products });
    });


    app.post('/productsById',async(req,res)=>{
      const ids =req.body
      const ObjectIds=ids.map(id=>ObjectId(id))
      const query = {_id : {$in : ObjectIds}}
      const cursor =productsCollection.find(query)
      const storeProducts=await cursor.toArray()
      res.send(storeProducts)
    })

  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Ema jhon simple server is running ");
});

app.listen(port, () => {
  console.log("Server is running in 5000 port ");
});
