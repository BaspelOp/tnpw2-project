const express = require('express');
const router = express.Router();
const pool = require('../server');

router.get('/getAll', async (_, res) => {
    try {
        const sql = `
            SELECT advertisements.id, advertisements.title, advertisements.description, advertisements.price, 
                    advertisements.location, advertisements.status, advertisements.created_at,
                    users.id AS user_id, users.username, users.email,
                    categories.id AS category_id, categories.name AS category_name
            FROM advertisements
            JOIN users ON advertisements.user_id = users.id
            JOIN categories ON advertisements.category_id = categories.id;
        `;

        pool.query(sql, (err, result) => {
            if (err) {
                console.error("Error getting advertisements: ", err);
                return res.status(500).json({ error: "Error getting advertisements" });
            }
            res.json(result);
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});