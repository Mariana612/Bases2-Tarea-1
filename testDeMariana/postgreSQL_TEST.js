const express = require('express');
const cors = require('cors');


const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());  // This will enable CORS for all routes
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
    user: 'master',
    password: 'pas1234',
    host: 'localhost',
    database: 'postgresdb',
    port: 5432,
});

app.get('/users/:username', async (req, res) => {
    const targetUsername = req.params.username;
    try {
        const result = await pool.query('SELECT * FROM get_user_info_by_username($1)', [targetUsername]);
        const userInfo = result.rows[0];
        if (userInfo) {
            res.json(userInfo);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error executing query');
    }
});

app.post('/addUser', async (req, res) => {
    const { username, password_hash, nombre_completo, fecha_nacimiento } = req.body;
    try {
        const result = await pool.query(
            'SELECT add_usuario($1, $2, $3, $4)',
            [username, password_hash, nombre_completo, fecha_nacimiento]
        );
        if (result.rowCount > 0) {
            console.log({ message: 'User added successfully' });
            res.status(201).json({ message: 'User added successfully' });

        } else {
            res.status(400).json({ error: 'No user was added' });
        }
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Error adding user' });
    }
});

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
