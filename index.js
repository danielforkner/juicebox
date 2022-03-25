require('dotenv').config();

// remove this once you confirm it works
console.log(process.env.JWT_SECRET);

const PORT = 3000;
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

server.use('/api', apiRouter);

const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
  console.log('Server is live on port:', PORT);
});
