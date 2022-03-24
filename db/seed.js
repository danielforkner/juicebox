const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  getAllPosts,
  getUserById,
  createTags,
  addTagsToPost,
  updatePost,
} = require('./index');

async function createInitialUsers() {
  try {
    console.log('Creating users...');

    const albert = await createUser({
      username: 'albert',
      password: 'bertie99',
      name: 'Albert',
      location: 'ohio',
    });

    const sandra = await createUser({
      username: 'sandra',
      password: '2sandy4me',
      name: 'Sandra',
      location: 'florida',
    });

    const glamgal = await createUser({
      username: 'glamgal',
      password: 'soglam',
      name: 'Peter',
      location: 'philly',
    });
  } catch (error) {
    console.error('Failed to create users.');
    throw error;
  }
}

async function createInitialPosts() {
  try {
    console.log('Creating initial posts...');
    const [albert, sandra, glamgal] = await getAllUsers();

    await createPost({
      authorID: albert.id,
      title: 'First Post',
      content:
        'This is my first post. I hope I love writing blogs as much as I love writing them.',
      tags: ['testing', 'tags', 'test'],
    });

    await createPost({
      authorID: sandra.id,
      title: 'First Post',
      content:
        'This is my first post. I hope I love writing blogs as much as I love writing them.',
      tags: ['testing', 'tags', 'test'],
    });

    await createPost({
      authorID: glamgal.id,
      title: 'First Post',
      content:
        'This is my first post. I hope I love writing blogs as much as I love writing them.',
      tags: ['testing', 'tags', 'test'],
    });
  } catch (error) {
    throw error;
  }
}

// async function createInitialTags() {
//   try {
//     console.log('Creating tags...');

//     const [bigdogs, smalldogs, largedogs, tinydogs, friendlydogs] =
//       await createTags([
//         'bigdogs',
//         'smalldogs',
//         'largedogs',
//         'tinydogs',
//         'friendlydogs',
//       ]);

//     const [postOne, postTwo, postThree] = await getAllPosts();

//     await addTagsToPost(postOne.id, [bigdogs, smalldogs]);
//     await addTagsToPost(postTwo.id, [largedogs, tinydogs]);
//     await addTagsToPost(postThree.id, [tinydogs, friendlydogs]);
//   } catch (error) {
//     console.log('ERROR: cannot create tags.');
//     throw error;
//   }
// }

// this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    console.log('Starting to drop tables...');

    await client.query(`
    DROP TABLE IF EXISTS post_tags;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS users;
        `);
  } catch (error) {
    throw error; // we pass the error up to the function that calls dropTables
  }
}

// this function should call a query which creates all tables for our database
async function createTables() {
  try {
    console.log('Building tables...');
    await client.query(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
    );`);

    await client.query(`
    CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        "authorID" INTEGER REFERENCES users(id) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
    )`);

    await client.query(`
    CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
    )`);

    await client.query(`
    CREATE TABLE post_tags (
        "postId" INTEGER REFERENCES posts(id),
        "tagId" INTEGER REFERENCES tags(id),
        UNIQUE("postId", "tagId")
    )`);
  } catch (error) {
    throw error; // we pass the error up to the function that calls createTables
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
    // await createInitialTags();
    console.log('DONE rebuilding db.');
  } catch (error) {
    console.error(error);
  }
}

async function testDB() {
  try {
    console.log('Testing database...');

    console.log('Calling getAllUsers...');
    const users = await getAllUsers();

    console.log('Calling updateUser on users[0]...');
    const updateUserResult = await updateUser(users[0].id, {
      name: 'Newname Sogood',
      location: 'Lesterville, KY',
    });

    console.log('Calling getAllPosts...');
    const posts = await getAllPosts();

    console.log('Calling getUserById with 1...');
    const albert = await getUserById(1);

    console.log('DONE with database tests.');

    console.log("Calling updatePost on posts[1], only updating tags");
    const updatePostTagsResult = await updatePost(posts[1].id, {
      tags: ["#youcandoanything", "#redfish", "#bluefish"]
    });
    console.log("Result:", updatePostTagsResult);

  } catch (error) {
    console.error(error);
  } finally {
    client.end();
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
