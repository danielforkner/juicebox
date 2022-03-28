const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

// tagsRouter.use('/', async (req, res) => {
//   const tags = await getAllTags();

//   res.send({ tags });
// });

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  const { tagName } = req.params;
  try {
    const posts = await getPostsByTagName(tagName);
    if (posts.length === 0) {
      next({
        name: 'no posts with this tag',
        message: 'does not exist',
      });
    } else {
      res.send(posts);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;
