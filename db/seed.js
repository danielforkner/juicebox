const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  getAllPosts,
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

    console.log('Finished creating users.');
  } catch (error) {
    console.error('Failed to create users.');
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    await createPost({
      authoID: albert.id,
      title: 'First Post',
      content:
        'This is my first post. I hope I love writing blogs as much as I love writing them.',
    });

    await createPost({
      authoID: sandra.id,
      title: 'First Post',
      content:
        'This is my first post. I hope I love writing blogs as much as I love writing them.',
    });

    await createPost({
      authoID: glamgal.id,
      title: 'First Post',
      content:
        'This is my first post. I hope I love writing blogs as much as I love writing them.',
    });
  } catch (error) {
    throw error;
  }
}

// this function should call a query which drops all tables from our database
async function dropTables() {
  try {
    console.log('starting to drop tables...');

    await client.query(`
    DROP TABLE IF EXISTS users;
        `);

    console.log('finished dropping tables.');
  } catch (error) {
    throw error; // we pass the error up to the function that calls dropTables
  }
}

// this function should call a query which creates all tables for our database
async function createTables() {
  try {
    console.log('building tables...');
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
    console.log('finished building tables.');
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
  } catch (error) {
    console.error(error);
  }
}

async function testDB() {
  try {
    console.log('testing database...');

    console.log('Calling getAllUsers');
    const users = await getAllUsers();
    console.log('getAllUsers:', users);

    console.log('Calling updateUser on users[0]');
    const updateUserResult = await updateUser(users[0].id, {
      name: 'Newname Sogood',
      location: 'Lesterville, KY',
    });
    console.log('Result:', updateUserResult);

    console.log('Calling getAllPosts');
    const posts = await getAllPosts();
    console.log('Posts:', posts);

    console.log('Finished database tests.');
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
