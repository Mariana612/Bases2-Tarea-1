const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// MongoDB URI - replace with your actual URI if different
const uri = "mongodb://root:example@localhost:27017";
const client = new MongoClient(uri);

// Create a new Express application
const app = express();
app.use(cors());  // This will enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies


async function main() {
    try {
        // Connect the MongoDB client
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const database = client.db('dataSetDB');
        const collection = database.collection('dataset');
        const commentCollection = database.collection('dataSetComment');

        // API to get dataset information by photo ID
        app.get('/dataset/:dataId', async (req, res) => {
            try {
                const dataId = parseInt(req.params.dataId);  // Correct variable name from req.params
                const datasetDocument = await collection.findOne({ "DatasetId": dataId });
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
                const { nombre, photoId, dataId, descripcion, fotoAvatar, archivos } = req.body;
                const datasetDocument = {
                    "Nombre": nombre,
                    "PhotoId": photoId,
                    "DatasetId": dataId,
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
        app.post('/comments', async (req, res) => {
            console.log(req.body); // Add this line to log the incoming request data
            try {
                const { idDataset, idUsuarioComment, comentario } = req.body;
                const result = await commentCollection.insertOne({
                    idDataset,
                    idUsuarioComment,
                    comentario
                });
                res.status(201).json(result);
            } catch (err) {
                console.error('Failed to insert comment:', err);
                res.status(500).send('Internal Server Error');
            }
        });

        // API to get comments by dataset ID
        app.get('/comments/:idDataset', async (req, res) => {
            try {
                const idDataset = parseInt(req.params.idDataset);
                const comments = await commentCollection.find({ idDataset }).toArray();
                res.json(comments);
            } catch (err) {
                console.error('Failed to fetch comments:', err);
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