// require in the database adapter functions as you write them (createUser, createActivity...)
import client from "../api/apiClient";

const { createUser, createPost } = require('./');

async function dropTables() {
  console.log('Dropping All Tables...');
  // drop all tables, in the correct order
  try {
    await  client.query(`
    DROP TABLE IF EXISTS routine_activities;
    DROP TABLE IF EXISTS routines;
    DROP TABLE IF EXISTS activities;
    DROP TABLE IF EXISTS users;
  `)
  } catch (error) {
    throw error; 
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");
    // create all tables, in the correct order

    await  client.query(`
      CREATE TABLE users(
        id  SERIAL PRIMARY KEY, 
        username VARCHAR(255) UNIQUE NOT NULL, 
        password VARCHAR(255) NOT NULL
      );
    `)

    await  client.query(`
      CREATE TABLE activities(
        id SERIAL PRIMARY KEY, 
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL
      );
    `)
    await  client.query(`
      CREATE TABLE routines(
        id SERIAL PRIMARY KEY, 
        "creatorId" INTEGER REFERENCES users(id),
        "isPublic" BOOLEAN DEFAULT false,
        name VARCHAR(255) UNIQUE NOT NULL,
        goal TEXT NOT NULL
      );
    `)
    await  client.query(`
      CREATE TABLE routine_activities(
        id SERIAL PRIMARY KEY, 
        "routineId" INTEGER REFERENCES routines(id),
        "activityId" INTEGER REFERENCES activities(id),
        duration INTEGER,
        count INTEGER,
        UNIQUE ("routineId", "activityId")
        );
    `)
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

/* 

DO NOT CHANGE ANYTHING BELOW. This is default seed data, and will help you start testing, before getting to the tests. 

*/

async function createInitialUsers() {
  console.log('Starting to create users...');
  try {

    const usersToCreate = [
      { username: 'albert', password: 'bertie99' },
      { username: 'sandra', password: 'sandra123' },
      { username: 'glamgal', password: 'glamgal123' },
    ]
    const users = await Promise.all(usersToCreate.map(createUser));

    console.log('Users created:');
    console.log(users);
    console.log('Finished creating users!');
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
}
async function createInitialPosts() {
  console.log('Starting to create posts...');

  try {
    const postsToCreate = [
      { userId: 1, title: 'First Post', content: 'This is the first post.', tags: ['tag1', 'tag2'] },
      { userId: 2, title: 'Second Post', content: 'This is the second post.', tags: ['tag3', 'tag4'] },

    ];

    const posts = await Promise.all(postsToCreate.map(createPost));

    console.log('Posts created:');
    console.log(posts);

    console.log('Finished creating posts!');
  } catch (error) {
    console.error('Error creating posts!');
    throw error;
  }
}

//const { client } = require('./client');

async function createInitialTags() {
  console.log('Starting to create tags...');

  try {
    const tagsToCreate = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];
    const tags = await Promise.all(tagsToCreate.map(tag => {
      return client.query(`
        INSERT INTO tags(name)
        VALUES($1)
        RETURNING *;
      `, [tag]);
    }));

    console.log('Tags created:');
    console.log(tags);

    console.log('Finished creating tags!');
  } catch (error) {
    console.error('Error creating tags!');
    throw error;
  }
}


async function rebuildDB() {
  try {
    await client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
    await createInitialTags();
  } catch (error) {
    console.log('Error during rebuildDB')
    throw error;
  }
}

module.exports = {
  rebuildDB
};
