const express = require('express');
const redis = require('redis');
const cors = require('cors');
const app = express();

app.use(cors());  // Enable CORS for all routes
app.use(express.json());

const client = redis.createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
});

client.on('connect', () => console.log('Connected to Redis'));
client.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
async function connectRedis() {
    await client.connect();
}
// API to add a user ID to a dataset
app.post('/dataset/users/add', async (req, res) => {
    const { datasetID, userID } = req.body;
    try {
        await client.lPush(`dataset:${datasetID}:users`, userID);
        res.status(201).send(`User ID ${userID} added to dataset ${datasetID}`);
    } catch (err) {
        console.error('Redis Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// API to get all user IDs from a dataset
app.get('/dataset/users/:datasetID', async (req, res) => {
    const { datasetID } = req.params;
    try {
        const userIDs = await client.lRange(`dataset:${datasetID}:users`, 0, -1);
        res.json({ datasetID, userIDs });
    } catch (err) {
        console.error('Redis Error:', err);
        res.status(500).send('Internal Server Error');
    }
});


// Disconnect Redis gracefully
async function closeConnection() {
    await client.disconnect();
}

const port = 3003;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    connectRedis();
});

process.on('SIGINT', async () => {
    await closeConnection();
    process.exit();
});