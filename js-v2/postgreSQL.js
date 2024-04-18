// Declare client as a global variable
let client;

function startClient() {
  const { Client } = require('pg');

  // Create a new PostgreSQL client
  client = new Client({
    user: 'master',
    password: 'pas1234',
    host: 'localhost', // Change this to your PostgreSQL host
    database: 'postgresdb',
    port: 5432, // Default PostgreSQL port
  });

  // Connect to the database
  client.connect();
}

function getUserData(targetUsername) {
  // Ensure client is connected before executing the query
  if (!client) {
    console.error('Client is not connected.');
    return;
  }

  client.query(
    'SELECT * FROM get_user_info_by_username($1)',
    [targetUsername],
    (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
      } else {
        const userInfo = result.rows[0];
        console.log('User Info:', userInfo);
        // Process the retrieved data as needed
      }
      // Close the database connection (optional, depending on your use case)
      //client.end();
    }
  );
}

function closeConnection() {
    // Close the database connection
    client.end();
  }

startClient();
getUserData('pame123');
getUserData('mari456');

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

async function closeConnection() {
await delay(2000);
client.end();
}

closeConnection();