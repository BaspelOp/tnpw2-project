const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const authenticateToken = require('../middleware/authenticateToken');

// Endpoint pro vytvoření kategorie - pouze pro administrátory
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        const user_role = req.user.role;

        if (user_role !== 'admin') {
            return res.status(403).json({ error: "Nemáte oprávnění k této akci!" });
        }
        
        if (!name) {
            return res.status(400).json({ error: "Není vyplněno name!" });
        }

        const [existing] = await pool.query(
            'SELECT * FROM category WHERE name = ?',
            [name]
        );

        if (existing.length > 0) {
            return res.status(409).json({ error: "Kategorie již existuje!" });
        }

        const [result] = await pool.query(
            'INSERT INTO category (name) VALUES (?)',
            [name]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({ error: "Kategorie nebyla vytvořena!" });
        }

        res.status(201).json({ message: "Kategorie byla úspěšně vytvořena!" });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

router.get('/get', async (_, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM category');
        res.status(200).json(categories);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

module.exports = router;