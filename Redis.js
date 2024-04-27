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



async function storeData(idDataset, idPersons) {
    const setKey = `data:${idDataset}:idPersons`;

    try {
        // Start a multi transaction
        const multi = client.multi();

        // Add multiple idPerson values to a set
        if (idPersons && idPersons.length > 0) {
            idPersons.forEach(idPerson => {
                multi.sAdd(setKey, idPerson);
            });
        }

        // Execute all commands in the multi transaction
        const result = await multi.exec();
        console.log('Data stored successfully:', result);
    } catch (err) {
        console.error('Error performing Redis operations:', err);
    }
}
async function addMoreIdPersons(id, newIdPersons) {
    const setKey = `data:${id}:idPersons`;
    try {
        // You can pass multiple members to sAdd
        const result = await client.sAdd(setKey, ...newIdPersons);
        console.log(`${result} new idPerson(s) added to the set`);
    } catch (err) {
        console.error('Error adding new idPersons to Redis:', err);
    }
}

async function getIdPersons(idDataset) {
    const setKey = `data:${idDataset}:idPersons`;
    try {
        const idPersons = await client.sMembers(setKey);
        if (idPersons.length === 0) {
            console.log('No idPersons found for:', idDataset);
            return null;
        }
        console.log('idPersons:', idPersons);
        return idPersons;
    } catch (err) {
        console.error('Error retrieving idPersons from Redis:', err);
    }
}

//----------------- CODIGO QUE PUEDE SER UTIL NO BORRAR PLOX ----------------
// async function getOtherData(idDataset) {
//     const hashKey = `data:${idDataset}`;
//     try {
//         const data = await client.hGetAll(hashKey);
//         if (Object.keys(data).length === 0) {
//             console.log('No additional data found for:', idDataset);
//             return null;
//         }
//         console.log('Other Data:', data);
//         return data;
//     } catch (err) {
//         console.error('Error retrieving data from Redis:', err);
//     }
// }

//getOtherData(1);
//----------------- CODIGO QUE PUEDE SER UTIL NO BORRAR PLOX ----------------



//-------------------------------- ACTIVAR PARA PRUEBAS ---------------------
conectRedis();
storeData('1', ['456', '789', '1011']);
getIdPersons('1');
addMoreIdPersons('1',['422'])
getIdPersons('1');
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
