import React, { useState } from "react";
import { Route } from "react-router-dom";
import axios from "axios";

function App() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  async function clickHandler() {
    const response = await axios.get("/api/posts");
    setPosts(response.data.posts);
  }
  async function clickHandler2() {
    const response = await axios.get("/api/tags");
    console.log(response.data.tags, "test");
    setTags(response.data.tags);
  }
  return (
    <div>
      <button onClick={clickHandler}>Get Posts</button>
      <div className="posts">
        {posts.map((post) => {
          return (
            <div className="postCard">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p>
                {post.tags.map((tag) => {
                  return `${tag.name} `;
                })}
              </p>
            </div>
          );
        })}
      </div>

      <button onClick={clickHandler2}>Get Tags</button>
      <div className="tags">
        {tags.map((tag) => {
          return <div>{tag.name}</div>;
        })}
      </div>
    </div>
  );
}

export default App;
