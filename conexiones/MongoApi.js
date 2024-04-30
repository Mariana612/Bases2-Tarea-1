const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const multer = require('multer'); //esto es lo que se debe instalar
const path = require('path');

// MongoDB URI - replace with your actual URI if different
const uri = "mongodb://root:example@localhost:27017";
const client = new MongoClient(uri);

// Create a new Express application
const app = express();
app.use(cors());  // This will enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

let counterIdDataset = 1;


async function main() {
    try {
        // Connect the MongoDB client
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const database = client.db('dataSetDB');
        const collection = database.collection('dataset');
        const commentCollection = database.collection('dataSetComment');


        //Sigue la secuencia del id
        async function getMaxDataId() {
            const result = await collection.findOne({}, { sort: { DatasetId: -1 }, projection: { DatasetId: 1 } });
            return result ? result.DatasetId : 0;
        }
        
        counterIdDataset= await getMaxDataId() + 1
        // Configuración de Multer para manejar la carga de archivos
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'Pagina1\\archivos'); // aquí va la ruta de la carpeta de destino para los archivos
            },
            filename: (req, file, cb) => {
                const fileName = `${counterIdDataset}-${file.fieldname}${path.extname(file.originalname)}`;
                cb(null, fileName);
            }
        });
        const upload = multer({ storage: storage });


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

        app.get('/datasetOwner/:dataId', async (req, res) => {
            try {
                const idowner = parseInt(req.params.dataId);  // Parse dataId to integer
                const datasetDocuments = await collection.find({ "OwnerId": idowner }).toArray();
                if (datasetDocuments.length > 0) {
                    res.json(datasetDocuments);
                } else {
                    res.status(404).send('Datasets not found for the specified OwnerId');
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
                res.status(500).send('Internal Server Error');
            }
        });

        // API to insert dataset
        /* app.post('/dataset', async (req, res) => {
            try {
                const { nombre, dataId, descripcion, fotoAvatar, archivos,idowner } = req.body;
                const datasetDocument = {
                    "Nombre": nombre,
                    "DatasetId": dataId,
                    "Descripción": descripcion,
                    "Fecha de Inclusión": new Date(),
                    "Foto o avatar": fotoAvatar,
                    "Archivo(s)": archivos,
                    "OwnerId": idowner
                };
                const result = await collection.insertOne(datasetDocument);
                res.status(201).json(result);
            } catch (err) {
                console.error('Failed to insert data:', err);
                res.status(500).send('Internal Server Error');
            }
        }); */

        // API para insertar dataset
        app.post('/dataset', upload.fields([{ name: 'photoAvatar', maxCount: 1 }, { name: 'archivosDatos', maxCount: 1 }]), async (req, res) => {
            try {
                //el requestbody se hace de esta manera porque se manda desde la estructura FormData
                const nombre = req.body.nombre;
                const descripcion = req.body.descripcion;
                const idowner = req.body.idowner;
                const idownerInt = parseInt(idowner, 10);//como se recibe como tipo string el id, se pasa a integer

                const photoAvatarUrl = req.files['photoAvatar'][0].path; // Obtén la ruta del avatar
                const archivoUrl = req.files['archivosDatos'][0].path; // Obtén la ruta del archivo de datos
                console.log(archivoUrl);

                const datasetDocument = {
                    "Nombre": nombre,
                    "DatasetId": counterIdDataset,
                    "Descripción": descripcion,
                    "Fecha de Inclusión": new Date(),
                    "Foto o avatar": photoAvatarUrl, // Usa la ruta del avatar
                    "Archivo(s)": archivoUrl, // Usa la ruta del archivo de datos
                    "OwnerId": idownerInt
                };

                const result = await collection.insertOne(datasetDocument);
                console.log('Counter de data:', datasetDocument.DatasetId);
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