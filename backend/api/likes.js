const express = require('express');
const likesRouter = express.Router();
const { requireUser } = require('../api/auth');
const { createLike, deleteLike, getLikesByPostId } = require('../db');

// POST /api/likes/:postId
likesRouter.post('/:postId', requireUser, async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;
        const like = await createLike({ postId, userId });

        res.send({ like });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/likes/:postId
likesRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;
        await deleteLike({ postId, userId });

        res.send({ message: 'Like deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// GET /api/likes/:postId
likesRouter.get('/:postId', async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const likes = await getLikesByPostId(postId);

        res.send({ likes });
    } catch (error) {
        next(error);
    }
});

module.exports = likesRouter;