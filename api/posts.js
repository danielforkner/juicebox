const express = require("express");
const postsRouter = express.Router();
const { getAllPosts, createPost, getUserByUsername } = require("../db");
const { requireUser } = require("./utils");

postsRouter.get("/", async (req, res, next) => {
  const posts = await getAllPosts();

  res.send({ posts });
});

postsRouter.post("/", requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/);
  const postData = {};

  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    const { id } = await getUserByUsername(req.user.username);
    const authID = id;
    postData.authorID = authID;
    postData.title = title;
    postData.content = content;
    console.log(postData);
    const post = await createPost(postData);
    if (post) {
      res.send({ post });
    } else {
      next({
        name: "Create Post Error",
        message: "Failed to create post",
      });
    }
  } catch ({ name, message }) {
    next({
      name,
      message,
    });
  }
});

module.exports = postsRouter;
