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

  
  async function getRowsContainingSubstring(tableName, substring) {
    const url = `http://localhost:8080/${tableName}/*`;

    try {
        const response = await axios.get(url, {
            headers: { 'Accept': 'application/json' }
        });
        const rows = response.data.Row;
        const filteredRows = rows.filter(row => {
            // Split the row key by '#' and check if any part exactly matches the substring
            const rowKeyParts = Buffer.from(row.key, 'base64').toString().split('#');
            return rowKeyParts.includes(substring); // Use includes to check for exact match in the array
        });

        // Log or process the filtered rows
        filteredRows.forEach(row => {
            const rowKey = Buffer.from(row.key, 'base64').toString();
            console.log(`Row Key: ${rowKey}`); // This will log only exact matches
        });

        return filteredRows.map(row => Buffer.from(row.key, 'base64').toString());
    } catch (error) {
        console.error('Failed to get data:', error.message);
    }
}

  async function getData(tableName, rowKey) {
    const encodedRowKey = encodeURIComponent(rowKey);
    const url = `http://localhost:8080/${tableName}/${encodedRowKey}`;

    try {
        const response = await axios.get(url, {
            headers: { 'Accept': 'application/json' }
        });
        const rows = response.data.Row;

        // Decode and log each cell in each row
        rows.forEach((row) => {
            console.log(`Row Key: ${Buffer.from(row.key, 'base64').toString()}`);
            row.Cell.forEach((cell) => {
                const column = Buffer.from(cell.column, 'base64').toString();
                const value = Buffer.from(cell['$'], 'base64').toString();
                console.log(`Column: ${column}, Value: ${value}`);
            });
        });
    } catch (error) {
        console.error('Failed to get data:', error.message);
    }
}

getData('UserMessages','1#2');
// putData('UserMessages','12#2','msgs','1','Hiii!')

module.exports = {
  putData,
  getData,
  getRowsContainingSubstring
};


