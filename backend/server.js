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