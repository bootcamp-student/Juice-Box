const { client } = require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

// user functions
async function createUser({ username, password }) {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    try {
        const { rows: [user] } = await client.query(`
            INSERT INTO users(username, password) VALUES($1, $2)
            ON CONFLICT (username) DO NOTHING 
            RETURNING id, username
            `, [username, hashedPassword]);
        return user;
    } catch (error) {
        throw error;
    }
}

async function getUser({ username, password }) {
    if (!username || !password) {
        return;
    }

    try {
        const user = await getUserByUsername(username);
        if (!user) return;
        const hashedPassword = user.password;
        const passwordsMatch = await bcrypt.compare(password, hashedPassword);
        if (!passwordsMatch) return;
        delete user.password;
        return user;
    } catch (error) {
        throw error;
    }
}

async function getUserByUsername(userName) {
    // first get the user
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM users
        WHERE username = $1;
      `, [userName]);
        // if it doesn't exist, return null
        if (!rows || !rows.length) return null;
        // if it does:
        // delete the 'password' key from the returned object
        const [user] = rows;
        // delete user.password;
        return user;
    } catch (error) {
        console.error(error)
    }
}

async function updateUser({ id, ...fields }) {
    try {
        const toUpdate = {}
        for (let column in fields) {
            if (fields[column] !== undefined) toUpdate[column] = fields[column];
        }
        let user;
        if (util.dbFields(fields).insert.length > 0) {
            const { rows } = await client.query(`
              UPDATE users 
              SET ${util.dbFields(toUpdate).insert}
              WHERE id=${id}
              RETURNING *;
          `, Object.values(toUpdate));
            user = rows[0];
            return user;
        }
    } catch (error) {
        throw error;
    }
}

async function destroyUser(id) {
    try {
        const { rows: [user] } = await client.query(`
            DELETE FROM users 
            WHERE id = $1
            RETURNING *
        `, [id]);
        return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser,
    getUser,
    getUserByUsername,
    updateUser,
    destroyUser,
};
