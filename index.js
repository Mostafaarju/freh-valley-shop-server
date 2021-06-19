const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2o4cg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect(err => {
  const productsCollection = client
    .db('freshValleyShop')
    .collection('products');
  //   client.close();

  // Save Product on Database
  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding new event: ', newProduct);
    productsCollection.insertOne(newProduct).then(result => {
      res.send(result.insertedCount > 0);
      console.log(result);
    });
  });
  // Get Products from database
  app.get('/products', (req, res) => {
    productsCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  // Get Product from Database using ID
  app.get('/products/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productsCollection.find({ _id: id }).toArray((err, product) => {
      res.send(product);
    });
  });

  // Find Product using id and Delete Product from Database
  app.delete('/deleteProduct/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productsCollection.deleteOne({ _id: id }).then(result => {
      res.send(result.deletedCount > 0);
    });
  });

  // Confirm Order and Save Order Details To Database
  app.post('/confirmOrder', (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder).then(result => {
      res.send(result.insertedCount > 0);
    });
  });

  // Load Products Base On User Email Address
  app.get('/orders', (req, res) => {
    console.log(req.query.useremail);
    const queryEmail = req.query.useremail;
    ordersCollection.find({ useremail: queryEmail }).toArray((err, product) => {
      res.send(product);
    });
  });
});

// Get Root System (/)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT || port);
