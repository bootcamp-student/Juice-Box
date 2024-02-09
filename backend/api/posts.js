const express = require('express');
const postsRouter = express.Router();
const client = require('../../index'); // Import the apiClient

const { requireUser } = require('./utils');

postsRouter.get('/', async (req, res, next) => {
  try {
    const { rows: allPosts } = await client.query('SELECT * FROM posts'); // Use the client to interact with the database

    const posts = allPosts.filter(post => {
      if (post.active) {
        return true;
      }

      if (req.user && post.author.id === req.user.id) {
        return true;
      }

      return false;
    });

    res.send({
      posts
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content = "" } = req.body;

  const postData = {};

  try {
    postData.authorId = req.user.id;
    postData.title = title;
    postData.content = content;

    const { rows } = await client.query('INSERT INTO posts (author_id, title, content) VALUES ($1, $2, $3) RETURNING *', [postData.authorId, postData.title, postData.content]); // Use the client to interact with the database

    if (rows[0]) {
      res.send(rows[0]);
    } else {
      next({
        name: 'PostCreationError',
        message: 'There was an error creating your post. Please try again.'
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});


module.exports = postsRouter;