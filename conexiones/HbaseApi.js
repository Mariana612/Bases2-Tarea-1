const express = require('express');
const cors = require('cors');
const { putData, getData, getRowsContainingSubstring } = require('./Hbase.js');
const app = express();

app.use(cors());

app.use(express.json());

// Store Data
app.post('/hbase/putData', async (req, res) => {
    const { tableName, rowKey, columnFamily, columnQualifier, value } = req.body;
    try {
        await putData(tableName, rowKey, columnFamily, columnQualifier, value);
        res.status(201).send('Data stored successfully');
    } catch (err) {
        console.error('Error storing data in HBase:', err);
        res.status(500).send('Error storing data');
    }
});

// Get Data by Row Key
app.get('/hbase/getData/:tableName/:rowKey', async (req, res) => {
    const { tableName, rowKey } = req.params;
    try {
        const result = await getData(tableName, rowKey);
        if (result && result.length > 0) {
            res.json(result);
        } else {
            res.status(404).send('No data found');
        }
    } catch (err) {
        console.error('Error retrieving data from HBase:', err);
        res.status(500).send('Error retrieving data');
    }
});

// Search Data by Substring in Row Key
app.get('/hbase/search/:tableName/:substring', async (req, res) => {
    const { tableName, substring } = req.params;
    try {
        const result = await getRowsContainingSubstring(tableName, substring);
        if (result && result.length > 0) {
            res.json(result);
        } else {
            res.status(404).send('No data found');
        }
    } catch (err) {
        console.error('Error searching data in HBase:', err);
        res.status(500).send('Error searching data');
    }
});

app.get('/UserMessages/:rowKey', async (req, res) => {
    const rowKey = decodeURIComponent(req.params.rowKey);
    console.log(`Fetching data for rowKey: ${rowKey}`);

    try {
        const data = await getData('UserMessages', rowKey);
        if (data && data.length > 0) {
            console.log(`Data retrieved successfully for rowKey: ${rowKey}`);
            res.json(data);
        } else {
            console.log(`No data found for rowKey: ${rowKey}`);
            res.status(404).send('No data found');
        }
    } catch (error) {
        console.error(`Error retrieving data for rowKey: ${rowKey}`, error);
        res.status(500).send('Server error');
    }
});

const port = 3004;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});