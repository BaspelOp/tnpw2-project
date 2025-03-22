require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs/promises');
const path = require('path');
const pool = null;

async function initDB() {
    console.log("Initializing database...");

    try {
        const dbConfig = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        };

        if (process.env.DB_PASSWORD) {
            dbConfig.password = process.env.DB_PASSWORD;
        }

        const connection = await mysql.createConnection(dbConfig);

        connection.connect(function(err) {
            if (err) {
                console.error("Error connecting to database: ", err);
                throw err;
            }
            console.log("Connected to database successfully!");
        })

        const dbSQL = await fs.readFile('./database_init/create_database.sql', 'utf-8');
        await connection.query(dbSQL);
        console.log("Database created (if not exists)");

        pool = mysql.createPool({
            ...dbConfig, // Použití stejného nastavení
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        async function runSQLFile(filePath) {
            const sql = await fs.readFile(filePath, 'utf-8');
            await pool.query(sql);
            console.log(`${path.basename(filePath)} executed successfully`);
        }

        // await runSQLFile('./database_init/users.sql');
        // await runSQLFile('./database_init/favorites.sql');

        await runSQLFile('./database_init/user.sql');
        await runSQLFile('./database_init/category.sql');
        await runSQLFile('./database_init/advertisement.sql');
        await runSQLFile('./database_init/image.sql');
        await runSQLFile('./database_init/favorites.sql');
        await runSQLFile('./database_init/review.sql');

        console.log("Database initialization complete!");
    } catch (err) {
        console.error("Database initialization failed:", err);
        throw err;
    }
}

module.exports = initDB;
module.exports = pool;