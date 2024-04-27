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
            // Decode the row key and check if it contains the substring
            const rowKey = Buffer.from(row.key, 'base64').toString();
            return rowKey.includes(substring);
        });

        // Log or process the filtered rows
        filteredRows.forEach(row => {
            const rowKey = Buffer.from(row.key, 'base64').toString();
            console.log(`Row Key: ${rowKey}`);
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

//getData('UserMessages','001#002');

module.exports = {
  putData,
  getData,
  getRowsContainingSubstring
};


