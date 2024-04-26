const express = require('express');
const { MongoClient } = require('mongodb');

// MongoDB URI - replace with your actual URI if different
const uri = "mongodb://root:example@localhost:27017";
const client = new MongoClient(uri);

// Create a new Express application
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

async function main() {
    try {
        // Connect the MongoDB client
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const database = client.db('dataSetDB');
        const collection = database.collection('dataset');

        // API to get dataset information by photo ID
        app.get('/dataset/:photoId', async (req, res) => {
            try {
                const photoId = parseInt(req.params.photoId);
                const datasetDocument = await collection.findOne({ "PhotoId": photoId });
                if (datasetDocument) {
                    res.json(datasetDocument);
                } else {
                    res.status(404).send('Dataset not found');
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
                res.status(500).send('Internal Server Error');
            }
        });

        // API to insert dataset
        app.post('/dataset', async (req, res) => {
            try {
                const { nombre, photoId, descripcion, fotoAvatar, archivos } = req.body;
                const datasetDocument = {
                    "Nombre": nombre,
                    "PhotoId": photoId,
                    "Descripción": descripcion,
                    "Fecha de Inclusión": new Date(),
                    "Foto o avatar": fotoAvatar,
                    "Archivo(s)": archivos
                };
                const result = await collection.insertOne(datasetDocument);
                res.status(201).json(result);
            } catch (err) {
                console.error('Failed to insert data:', err);
                res.status(500).send('Internal Server Error');
            }
        });

        const port = 3002;
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}

main().catch(console.error);

// Graceful shutdown
process.on('SIGINT', async () => {
    await client.close();
    process.exit();
});