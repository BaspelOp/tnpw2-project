const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const authenticateToken = require('../middleware/authenticateToken');

// Endpoint pro přidání inzerátu do oblíbených
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { advertisement_id } = req.body;
        const user_id = req.user.id;

        if (!user_id || !advertisement_id) {
            return res.status(400).json({ error: "Není vyplněno user_id nebo advertisement_id!" });
        }

        const [existing] = await pool.query(
            'SELECT * FROM favorite WHERE user_id = ? AND advertisement_id = ?',
            [user_id, advertisement_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({ error: "Inzerát již v oblíbených!" });
        }

        const [result] = await pool.query(
            'INSERT INTO favorite (user_id, advertisement_id) VALUES (?, ?)',
            [user_id, advertisement_id]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({ error: "Inzerát nebyl přidán do oblíbených!" });
        }

        res.status(201).json({ message: "Inzerát byl úspěšně přidán do oblíbených!" });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

// Endpoint pro odstranění inzerátu z oblíbených
router.post('/remove', authenticateToken, async (req, res) => {
    try {
        const { advertisement_id } = req.body;
        const user_id = req.user.id;

        if (!user_id || !advertisement_id) {
            return res.status(400).json({ error: "Není vyplněno user_id nebo advertisement_id!" });
        }

        const [result] = await pool.query(
            'DELETE FROM favorite WHERE user_id = ? AND advertisement_id = ?',
            [user_id, advertisement_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Inzerát nebyl nalezen v oblíbených!" });
        }

        res.json({ message: "Inzerát byl úspěšně odstraněn z oblíbených!" });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

// Endpoint pro get všech oblíbených inzerátů
router.post('/getById', async (req, res) => {
    try {
        const user_id = req.body.user_id;

        if (!user_id) {
            return res.status(400).json({ error: "Není vyplněno user_id!" });
        }

        const [result] = await pool.query(`
            SELECT advertisement.id, advertisement.title, advertisement.description, advertisement.price,
                   advertisement.location, advertisement.status, advertisement.created_at,
                   users.id AS user_id, users.username, users.email,
                   category.id AS category_id, category.name AS category_name
            FROM favorite
            JOIN advertisement ON favorite.advertisement_id = advertisement.id
            JOIN users ON advertisement.user_id = users.id
            JOIN category ON advertisement.category_id = category.id
            WHERE favorite.user_id = ?;
        `, [user_id]);

        res.json(result);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

module.exports = router;