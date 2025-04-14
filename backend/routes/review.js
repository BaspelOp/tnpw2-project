const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const authenticateToken = require('../middleware/authenticateToken');

// Endpoint pro vytvoření recenze
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const reviewer_id = req.user.id;
        const { reviewed_id, rating, comment } = req.body;

        if (!reviewer_id || !reviewed_id || !rating) {
            return res.status(400).json({ error: "Není vyplněno reviewer_id, reviewed_id nebo rating!" });
        }

        const [result] = await pool.query(
            'INSERT INTO review (reviewer_id, reviewed_id, rating, comment) VALUES (?, ?, ?, ?)',
            [reviewer_id, reviewed_id, rating, comment]
        )

        if (result.affectedRows === 0) {
            return res.status(500).json({ error: "Vytvoření recenze se nezdařilo!" });
        }

        res.status(201).json({ message: "Recenze byla úspěšně vytvořena!" });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

// Endpoint pro get recenzí podle user id
router.get('/getById', async (req, res) => {
    try {
        const { user_id } = req.body;

        const [reviews] = await pool.query(`
            SELECT r.id, r.rating, r.comment, r.created_at,
                    u.id AS reviewer_id, u.username AS reviewer_username
            FROM review r
            JOIN users u ON r.reviewer_id = u.id
            WHERE r.reviewed_id = ?
            ORDER BY r.created_at DESC
        `, [user_id]);

        const [avgResult] = await pool.query(`
            SELECT AVG(r.rating) AS average_rating
            FROM review r
            WHERE r.reviewed_id = ?
        `, [user_id]);

        res.json({
            reviews: reviews,
            average_rating: avgResult[0].average_rating || 0
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});