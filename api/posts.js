const express = require('express');
const postsRouter = express.Router();
const {
  getAllPosts,
  createPost,
  getUserByUsername,
  updatePost,
  getPostById,
} = require('../db');
const { requireUser } = require('./utils');

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
  try {
    const post = await getPostById(req.params.postId);

    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });

      res.send({ post: updatedPost });
    } else {
      if (!post) {
        next({
          name: 'Post does not exist',
          message: 'You cannot delete something that does not exist',
        });
      } else {
        next({
          name: 'Unauthorized',
          message: "You cannot delete someone else's post",
        });
      }
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.get('/', async (req, res, next) => {
  try {
    const allPosts = await getAllPosts();
    const posts = allPosts.filter((post) => {
      return post.active || (req.user && post.author.id === req.user.id);
    });

    res.send({ posts });
  } catch (error) {}
});

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = '' } = req.body;

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
        name: 'Create Post Error',
        message: 'Failed to create post',
      });
    }
  } catch ({ name, message }) {
    next({
      name,
      message,
    });
  }
});

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;
  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost });
    } else {
      next({
        name: 'unAuthorizedUserError',
        message: 'You cannot update a post that is not yours',
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = postsRouter;
