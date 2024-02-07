const { client } = require('../api/apiClient');
const { dbFields } = require('./util');

async function createPost({ authorId, title, content, tags = [] }) {
    const fields = { author_id: authorId, title, content };
    const insertString = dbFields(fields);

    try {
        const { rows: [post] } = await client.query(`
      INSERT INTO posts(${Object.keys(fields).join(', ')})
      VALUES(${insertString})
      RETURNING *;
    `, Object.values(fields));

        if (tags.length > 0) {
            await Promise.all(tags.map(
                tag => client.query(`
          INSERT INTO post_tags(post_id, tag_id)
          VALUES ($1, $2)
        `, [post.id, tag])
            ));
        }

        return post;
    } catch (error) {
        throw error;
    }
}

async function updatePost(id, fields = {}) {
    const setString = dbFields(fields);

    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [post] } = await client.query(`
      UPDATE posts
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

        return post;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};