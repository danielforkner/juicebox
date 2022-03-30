import React from "react";
import { Route } from "react-router-dom";
import axios from "axios";

async function clickHandler() {
  const response = await axios.get("/api/posts");
  console.log(response);
}

function App() {
  return <button onClick={clickHandler}>Get Posts</button>;
}

export default App;
