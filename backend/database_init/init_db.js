require('dotenv').config();
const fs = require('fs/promises');
const path = require('path');

async function initDB(connection, pool) {
    console.log("Initializing database...");

    try {
        const dbSQL = await fs.readFile('./database_init/create_database.sql', 'utf-8');
        await connection.query(dbSQL);
        console.log("Database created (if not exists)");

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