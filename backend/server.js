require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'bazar',
    port: process.env.DB_PORT || 3306
});

// Tady přidám vytvoření tabulek při startu, pokud nebudou vytvořeny :)


// API pro získání ...
app.get('api/advertisements', async (req, res) => {
    try {
        // const connection = await pool.getConnection();
        // const [results] = await connection.query('SELECT * FROM advertisements');
        // connection.release();
        // res.json(results);

        res.json("Testovací data");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Server is running...'));