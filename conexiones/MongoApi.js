const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// MongoDB URI - replace with your actual URI if different
const uri = "mongodb://root:example@localhost:27017";
const client = new MongoClient(uri);

// Create a new Express application
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

let photoIdCounter = 1; // Inicializar el contador en 1
let dataIdCounter = 1; // Inicializar el contador en 1

async function main() {
    try {
        // Connect the MongoDB client
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const database = client.db('dataSetDB');
        const collection = database.collection('dataset');

        // Obtener el valor máximo actual de PhotoId en la base de datos
        async function getMaxPhotoId() {
            const result = await collection.findOne({}, { sort: { PhotoId: -1 }, projection: { PhotoId: 1 } });
            return result ? result.PhotoId : 0;
        }

        // Inicializar photoIdCounter con el valor máximo actual de PhotoId + 1
        photoIdCounter = await getMaxPhotoId() + 1;

        //Sigue la secuencia del id
        async function getMaxDataId() {
            const result = await collection.findOne({}, { sort: { DatasetId: -1 }, projection: { DatasetId: 1 } });
            return result ? result.DatasetId : 0;
        }
        //inicia dataCounter
        dataIdCounter= await getMaxDataId() + 1;

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
                const { nombre, descripcion, fotoAvatar, archivos } = req.body;
                
                const datasetDocument = {
                    "Nombre": nombre,
                    "PhotoId": photoIdCounter++,
                    "DatasetId": dataIdCounter++,
                    "Descripción": descripcion,
                    "Fecha de Inclusión": new Date(),
                    "Foto o avatar": fotoAvatar,
                    "Archivo(s)": archivos
                };
                const result = await collection.insertOne(datasetDocument);
                console.log('counter de photo',photoIdCounter);
                console.log('counter de data',dataIdCounter);
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