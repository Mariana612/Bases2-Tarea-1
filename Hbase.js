const axios = require('axios');

async function putData(tableName, rowKey, columnFamily, columnQualifier, value) {
    const url = `http://localhost:8080/${tableName}/${rowKey}/${columnFamily}:${columnQualifier}`;
    const data = {
      Row: [{
        key: Buffer.from(rowKey).toString('base64'),
        Cell: [{ column: Buffer.from(`${columnFamily}:${columnQualifier}`).toString('base64'), $: Buffer.from(value).toString('base64') }]
      }]
    };
  
    try {
      const response = await axios.put(url, data, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      console.log('Data inserted:', response.data);
    } catch (error) {
      console.error('Failed to put data:', error.message);
    }
  }
  async function getData(tableName, rowKey) {
    const url = `http://localhost:8080/${tableName}/${rowKey}`;
  
    try {
      const response = await axios.get(url, {
        headers: { 'Accept': 'application/json' }
      });
      console.log('Data retrieved:', response.data);
    } catch (error) {
      console.error('Failed to get data:', error.message);
    }
  }

//createTable('UserMessages', 'msgs');
putData('UserMessages', '001#002', 'msgs', '123', 'good!');
getData('UserMessages', '001#002');