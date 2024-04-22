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

    