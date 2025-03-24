const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../database');

router.post('/register', async (req, res) => {
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

        await pool.query(sql, values, (err, res) => {
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

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.hashedPassword);

        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json({ message: "Logged in successfully" });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

module.exports = router;