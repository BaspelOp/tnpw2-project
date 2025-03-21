require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDB = require('./database_init/init_db');
const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
    try {
        await initDB();
        console.log("Database initialized successfully!");

        app.listen(3000, () => {
            console.log("Server is running on http://localhost:3000");
        });

    } catch (err) {
        console.error("Error starting server: ", err);
        process.exit(1);
    }
}

startServer();

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