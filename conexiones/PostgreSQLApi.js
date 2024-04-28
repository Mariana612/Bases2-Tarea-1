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
    const passwordHash = req.query.passwordHash; // Assuming the password hash is provided as a query parameter
    try {
        const result = await pool.query(
            'SELECT * FROM get_user_info_by_username_and_password($1, $2)',
            [targetUsername, passwordHash]
        );
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

app.post('/updateUser', async (req, res) => {
    const {idUser, username, password_hash, nombre_completo, fecha_nacimiento } = req.body;
    try {
        const result = await pool.query(
            'SELECT update_user_info_by_id($1, $2, $3, $4, $5)',
            [idUser,username, password_hash, nombre_completo, fecha_nacimiento]
        );
        if (result.rowCount > 0) {
            console.log({ message: 'User updated successfully' });
            res.status(201).json({ message: 'User updated successfully' });

        } else {
            res.status(400).json({ error: 'No user was updated' });
        }
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Error updating user' });
    }
});

app.get('/getIfo/:idUser', async (req, res) => {
    const idUser = req.params.idUser;
    
    try {
        const result = await pool.query(
            'SELECT * FROM get_user_info_by_id($1)',
            [idUser]
        );
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

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
