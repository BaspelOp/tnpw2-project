const express = require('express');
const router = express.Router();
const { pool } = require('../database');

router.get('/getAll', async (_, res) => {
    try {
        const [result] = await pool.query(`
            SELECT advertisements.id, advertisements.title, advertisements.description, advertisements.price, 
                    advertisements.location, advertisements.status, advertisements.created_at,
                    users.id AS user_id, users.username, users.email,
                    categories.id AS category_id, categories.name AS category_name
            FROM advertisements
            JOIN users ON advertisements.user_id = users.id
            JOIN categories ON advertisements.category_id = categories.id;
        `, []);

        res.json(result);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

router.get('/getById', async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ error: "Není vyplněno user_id!" });
        }

        const {result} = await pool.query(`
            SELECT advertisements.id, advertisements.title, advertisements.description, advertisements.price,
                    advertisements.location, advertisements.status, advertisements.created_at,
                    users.id AS user_id, users.username, users.email,
                    categories.id AS category_id, categories.name AS category_name
            FROM advertisements
            JOIN users ON advertisements.user_id = users.id
            JOIN categories ON advertisements.category_id = categories.id
            WHERE user_id = ?;
        `)

        res.json(result);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

router.post('/create', async (req, res) => {
    try {
        const { user_id, category_id, title, description, price, location } = req.body;

        if (!user_id || !category_id || !title || !description || !price || !location) {
            return res.status(400).json({ error: "Všechna pole nejsou vyplněna!" });
        };

        const [result] = await pool.query(
            'INSERT INTO advertisements (user_id, category_id, title, description, price, location) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, category_id, title, description, price, location]
        )

        if (result.affectedRows === 0) {
            return res.status(500).json({ error: "Vytvoření inzerátu se nezdařilo!" });
        }

        res.status(201).json({ message: "Inzerát byl úspěšně vytvořen!" });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

module.exports = router;