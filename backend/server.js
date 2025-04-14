require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const initDB = require('./database_init/init_db');
const { pool, dbConfig } = require('./database');
const userRoutes = require('./routes/user');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));

async function startServer() {
    try {

        if (process.env.DB_PASSWORD) {
            dbConfig.password = process.env.DB_PASSWORD;
        }

        console.log("Connecting to database...");
        const connection = await mysql.createConnection(dbConfig);

        if (!connection) {
            throw new Error("Connection to database failed");
        }
        console.log("Connected to database successfully!");

        await initDB(connection, pool);
        console.log("Database initialized successfully!");

        app.use('/api/users', userRoutes);

        app.listen(3000, () => {
            console.log("Server is running on http://localhost:3000");
        });

    } catch (err) {
        console.error("Error starting server: ", err);
        process.exit(1);
    }
}

startServer();