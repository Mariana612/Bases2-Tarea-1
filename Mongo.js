const { MongoClient } = require('mongodb');

// MongoDB URI - replace with your actual URI if different
const uri = "mongodb://root:example@localhost:27017";

// Create a new MongoClient
const client = new MongoClient(uri);

async function getDatasetInfo(photoId) {
    try {
        // Connect the client to the server
        await client.connect();

        // Establish and verify connection
        const database = client.db('dataSetDB');
        const collection = database.collection('dataset');

        // Finding the document
        const datasetDocument = await collection.findOne({ "PhotoId": photoId });
        return datasetDocument;
    } catch {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}





async function insertDataset(nombre, photoId, descripcion, fotoAvatar, archivos) {
    try {
        await client.connect();
        const database = client.db('dataSetDB');
        const collection = database.collection('dataset');
        const datasetDocument = {
            "Nombre": nombre,
            "PhotoId": photoId,
            "Descripción": descripcion,
            "Fecha de Inclusión": new Date(),
            "Foto o avatar": fotoAvatar,
            "Archivo(s)": archivos
        };
        const result = await collection.insertOne(datasetDocument);
        return result;
    } catch {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

// Example usage:

// Insert a dataset
insertDataset("Dataset 4", 4, "A sample dataset", "\Pagina3\imagenes\buscar.png", ["\Pagina3\imagenes\buscar.png"]).then(result => {
    console.log('Insert Result:', result);
}).catch(err => {
    console.error('Insert Error:', err);
});

getDatasetInfo(1).then(result => {
    console.log('Dataset Information:', result);
}).catch(err => {
    console.error('An error occurred:', err);
});

getDatasetInfo(2).then(result => {
    console.log('Dataset Information:', result);
    client.close();

}).catch(err => {
    console.error('An error occurred:', err);
});