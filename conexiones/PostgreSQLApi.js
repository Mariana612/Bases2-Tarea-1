const express = require('express');
const cors = require('cors');
const multer = require('multer'); //esto es lo que se debe instalar



const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());  // This will enable CORS for all routes
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

        // Configuración de Multer para manejar la carga de archivos
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'Pagina1\\Pagina3\\archivos'); // aquí va la ruta de la carpeta de destino para los archivos
            },
            filename: async (req, file, cb) => {
                try {
                    // Obtener el próximo ID de dataset
                    const nextDatasetId = Date.now();
        
                    // Construir el nombre del archivo con el ID del dataset
                    const fileName = `${nextDatasetId}-${file.fieldname}${path.extname(file.originalname)}`;
                    
                    cb(null, fileName);
                } catch (err) {
                    cb(err); // Manejar el error en caso de que falle la obtención del próximo ID de dataset
                }
            }
        });
        const upload = multer({ storage: storage });

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

//esta es la de obtener user
// PostgreSQL API to get user information by username
app.get('/getuser/:username', async (req, res) => {
    const targetUsername = req.params.username.trim().toLowerCase();  // Ensure case insensitivity
    try {
        const query = 'SELECT * FROM usuarios WHERE lower(username) = $1';
        const result = await pool.query(query, [targetUsername]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);  // Send user data if found
        } else {
            res.status(404).send('User not found');  // Handle no user found
        }
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error executing query');
    }
});

app.get('/usersId/:usID', async (req, res) => {
    const targetId = req.params.usID;
    try {
        const result = await pool.query(
            'SELECT * FROM  get_user_info_by_id($1)',
            [targetId]
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
// app.post('/updateUser', async (req, res) => {
//     const { idUser, username, password_hash, nombre_completo, fecha_nacimiento } = req.body;

//     try {
//         const result = await pool.query(
//             `UPDATE usuarios SET username = $1, password_hash = $2, nombre_completo = $3, fecha_nacimiento = $4, userPhoto = $5 WHERE idUser = $6`,
//             [username, password_hash, nombre_completo, fecha_nacimiento, userPhoto, idUser]
//         );

//         if (result.rowCount > 0) {
//             res.status(200).json({ message: 'User updated successfully' });
//         } else {
//             res.status(404).json({ error: 'User not found' });
//         }
//     } catch (err) {
//         console.error('Error executing query:', err);
//         res.status(500).json({ error: 'Error updating user' });
//     }
// });
app.post('/updateUser', upload.single('userPhoto'), async (req, res) => { // ABER QUE PASA
    const idUser = req.body.idUser;
    const username = req.body.username;
    const password_hash = req.body.password_hash;
    const nombre_completo = req.body.nombre_completo;
    const fecha_nacimiento = req.body.fecha_nacimiento;
    const userPhoto = req.file ? req.file.path : null;  // Handling file, assuming it's optional

    console.log(userPhoto);
    try {
        const result = await pool.query(
            `UPDATE usuarios SET username = $1, password_hash = $2, nombre_completo = $3, fecha_nacimiento = $4, userPhoto = $5 WHERE idUser = $6`,
            [username, password_hash, nombre_completo, fecha_nacimiento, userPhoto, idUser]
        );

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Error updating user' });
    }
});

app.post('/addUser', upload.single('userPhoto'), async (req, res) => {
    const idUser = req.body.idUser;
    const username = req.body.username;
    const password_hash = req.body.password_hash;
    const nombre_completo = req.body.nombre_completo;
    const fecha_nacimiento = req.body.fecha_nacimiento;
    const userPhoto = req.file ? req.file.path : null;  // Handling file, assuming it's optional
    console.log(userPhoto);
    
    try {
        const result = await pool.query(
            'SELECT add_usuario($1, $2, $3, $4, $5)',
            [username, password_hash, nombre_completo, fecha_nacimiento, userPhoto]
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
// app.post('/addUser', async (req, res) => {
//     const { username, password_hash, nombre_completo, fecha_nacimiento, userPhoto } = req.body;
//     try {
//         const result = await pool.query(
//             'SELECT add_usuario($1, $2, $3, $4, $5)',
//             [username, password_hash, nombre_completo, fecha_nacimiento, userPhoto]
//         );
//         if (result.rowCount > 0) {
//             console.log({ message: 'User added successfully' });
//             res.status(201).json({ message: 'User added successfully' });

//         } else {
//             res.status(400).json({ error: 'No user was added' });
//         }
//     } catch (err) {
//         console.error('Error executing query:', err);
//         res.status(500).json({ error: 'Error adding user' });
//     }
// });

app.get('/allUsers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM get_all_users()');
        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.status(404).send('No users found');
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
