const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../server');

router.post('/', async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        if (!username || !email || !phone || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = `
            INSERT INTO user (username, email, phone, hashedPassword)
            VALUES (?, ?, ?, ?)
        `;
        const values = [username, email, phone, hashedPassword];

        pool.query(sql, values, (err, res) => {
            if (err) {
                console.error("Error registering user: ", err);
                return res.status(500).json({ error: "Error registering user" });
            }
            res.status(201).json({ message: "User registered successfully" });
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

module.exports = router;