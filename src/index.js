require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');

const app = express();
app.use(express.json());

app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/as64a_users';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
