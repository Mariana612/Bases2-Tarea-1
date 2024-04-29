const redis = require('redis');

// Create and connect the Redis client
const client = redis.createClient({
    socket: {
        host: 'localhost',
        port: 6379
    }
});


client.on('connect', () => console.log('Connected to Redis'));
client.on('error', (err) => console.error('Redis Client Error', err));


async function addUserIDToDataset(datasetID, userID) {
    await client.lPush(`dataset:${datasetID}:users`, userID);
    console.log(`User ID ${userID} added to dataset ${datasetID}`);
}

// Function to get all userIDs associated with a dataset
async function getUserIDsFromDataset(datasetID) {
    const userIDs = await client.lRange(`dataset:${datasetID}:users`, 0, -1);
    console.log(`User IDs for dataset ${datasetID}: ${userIDs}`);
    return userIDs;
}


//-------------------------------- ACTIVAR PARA PRUEBAS ---------------------
conectRedis();
addUserIDToDataset('1','2') ;
addUserIDToDataset('1','3') ;
getUserIDsFromDataset('1');

closeConnection();
//-------------------------------- ACTIVAR PARA PRUEBAS ---------------------


async function conectRedis(){
    await client.connect();
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function closeConnection() {                          //Cierra la conexion con el cliente (unicamente cierrelo cuando el usuario ciera la aplicacion)
    await delay(2000);
    client.disconnect() ;
}
