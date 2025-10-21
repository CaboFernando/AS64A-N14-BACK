import express from 'express';
import { MongoClient as client  } from 'mongodb';

let db;

const app = express();
const PORT = 3000;

let counter = 0;

app.get('/', async (req, res) => {
  const connection = await client.connect('mongodb://mongo:27017');
  db = connection.db('testdb');

  const visits = db.collection('visits');
  await visits.insertOne({ date: new Date(), id: counter++ });
  const allVisits = await visits.find({}).toArray();
  res.json(allVisits);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});