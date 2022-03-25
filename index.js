const PORT = 3000;
const server = require('express')();

server.use((req, res, next) => {
  console.log('<____Body Logger START____>');
  console.log(req.body);
  console.log('<_____Body Logger END_____>');

  next();
});

server.use('/api', (req, res, next) => {
  console.log('A request was made to /api');
  next();
});

server.listen(PORT, () => {
  console.log('Server is live on port:', PORT);
});
