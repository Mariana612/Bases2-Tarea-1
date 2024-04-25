const express = require('express');
const { MongoClient } = require('mongodb');
const { Pool } = require('pg');
const { getDatasetInfo } = require('./Mongo_test');
const { getUserInfo } = require('./postgreSQL_TEST');

const app = express();
app.use(express.json());

// MongoDB setup
const mongoUri = "mongodb://localhost:27017";
const mongoClient = new MongoClient(mongoUri);

// PostgreSQL setup
const pgPool = new Pool({
    user: 'master',
    host: 'localhost',
    database: 'postgresdb',
    password: 'pas1234',
    port: 5432,
});

async function connectDatabases() {
    try {
        await mongoClient.connect();
        console.log("Connected to MongoDB");
        await pgPool.connect();
        console.log("Connected to PostgreSQL");
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

connectDatabases();

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.get('/mongo/dataset/:photoId', async (req, res) => {
    const photoId = parseInt(req.params.photoId);
    const data = await getDatasetInfo(photoId);
    res.json(data);
});

app.get('/postgres/user/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = await getUserInfo(userId);
    res.json(user);
});
