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

// Store Data
app.post('/storeData', async (req, res) => {
    const { idDataset, idPersons } = req.body;
    const setKey = `data:${idDataset}:idPersons`;

    try {
        await client.sAdd(setKey, idPersons);
        res.status(201).send('Data stored successfully');
    } catch (err) {
        console.error('Error storing data in Redis:', err);
        res.status(500).send('Error storing data');
    }
});

// Get IdPersons
app.get('/getIdPersons/:idDataset', async (req, res) => {
    const setKey = `data:${req.params.idDataset}:idPersons`;
    try {
        const idPersons = await client.sMembers(setKey);
        if (idPersons.length === 0) {
            res.status(404).send('No idPersons found');
        } else {
            res.json(idPersons);
        }
    } catch (err) {
        console.error('Error retrieving idPersons from Redis:', err);
        res.status(500).send('Error retrieving data');
    }
});

// Add More IdPersons
app.patch('/addMoreIdPersons', async (req, res) => {
    const { id, newIdPersons } = req.body;
    const setKey = `data:${id}:idPersons`;
    try {
        await client.sAdd(setKey, newIdPersons);
        res.send(`${newIdPersons.length} new idPerson(s) added to the set`);
    } catch (err) {
        console.error('Error adding new idPersons to Redis:', err);
        res.status(500).send('Error updating data');
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