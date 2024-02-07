const { client } = require('../api/apiClient');

async function getAllTags() {
    try {
        const { rows: tags } = await client.query(`
            SELECT *
            FROM tags;
        `);

        return tags;
    } catch (error) {
        throw error;
    }
}

async function getPostsByTagName(tagName) {
    try {
        const { rows: posts } = await client.query(`
            SELECT posts.*
            FROM posts
            JOIN post_tags ON posts.id=post_tags.post_id
            JOIN tags ON tags.id=post_tags.tag_id
            WHERE tags.name=$1;
        `, [tagName]);

        return posts;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllTags,
    getPostsByTagName
};