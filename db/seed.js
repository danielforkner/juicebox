const { client, getAllUsers } = require('./index');

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
        password varchar(255) NOT NULL
    );`);
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
  } catch (error) {
    console.error(error);
  }
}

async function testDB() {
  try {
    console.log('testing database...');

    const users = await getAllUsers();

    console.log('getAllUsers:', users);
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
