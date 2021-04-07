const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ttm7i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const port = 5000

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("amaJhonServer").collection("products");
  const orderCollection = client.db("amaJhonServer").collection("orderProducts");
  console.log('this is work')


  app.post('/addProduct', (req, res) => {
      const product = req.body;
      collection.insertOne(product)
      .then(result => {
          console.log(result)
      })
  })

  app.get('/products', (req, res)=> {
    collection.find({})
    .toArray((error, document)=>{
      res.send(document);
    })
  })

  app.get('/product/:key', (req, res) => {
    collection.find({key: req.params.key})
    .toArray((err, document)=> {
      res.send(document[0])
    })
  })



  app.post('/productWithKey', (req, res)=>{
    const productKeys = req.body;
    console.log(productKeys)
    collection.find({key: { $in: productKeys}})
    .toArray((err, document) => {
      res.send(document);
    })
  })

  app.post('/orderDetails', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

}); 



app.get('/', (req, res) => {
  res.send('Hello Tonmoy Kumar Roy!')
})

app.listen(process.env.PORT || port)