require("dotenv").config();

const { PORT = 3000 } = process.env;
const express = require("express");
const server = express();
const apiRouter = require("./api");
const morgan = require("morgan");
const path = require("path");

server.use(morgan("dev"));
server.use(express.json());
server.use(express.static(path.join(__dirname, "build")));
server.use(express.static("public"));

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

server.use("/api", apiRouter);

const { client } = require("./db");
client.connect();

server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
server.listen(PORT, () => {
  console.log("Server is live on port:", PORT);
});
