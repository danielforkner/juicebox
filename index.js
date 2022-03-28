require('dotenv').config();

const { PORT = 3000 } = process.env;
const express = require('express');
const server = express();
const apiRouter = require('./api');
const morgan = require('morgan');

server.use(morgan('dev'));
server.use(express.json());

server.use((req, res, next) => {
  console.log('<____Body Logger START____>');
  console.log(req.body);
  console.log('<_____Body Logger END_____>');

  next();
});

server.get('/', (req, res, next) => {
  res.send("Welcome to Daniel and Derrick's JuiceBox App!");
});

server.use('/api', apiRouter);

const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
  console.log('Server is live on port:', PORT);
});
