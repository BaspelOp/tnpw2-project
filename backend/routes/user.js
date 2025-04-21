const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../database');

// Pro validaci příchozích dat
const { body, validationResult } = require('express-validator');

// JWT autentikace
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

// Endpoint pro registraci uživatele
router.post('/register', [
        body('email').isEmail().withMessage('Email není platný!'),
        body('phone').isMobilePhone('cs-CZ').withMessage('Telefonní číslo není platné!'),
        body('password').isLength({ min: 8 }).withMessage('Heslo musí mít alespoň 8 znaků'),
        body('username').isLength({ min: 3 }).withMessage('Uživatelské jméno musí mít alespoň 3 znaky')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Získání dat z těla požadavku
        const { username, email, phone, password } = req.body;

        // Kontrola, zda jsou všechna pole vyplněna
        if (!username || !email || !phone || !password) {
            return res.status(400).json({ error: "Všechna pole nejsou vyplněna!" });
        }

        // Kontrola, zda uživatel již existuje
        const [existing] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR username = ? OR phone = ?', 
            [email, username, phone]
        );

        if (existing.length > 0) {
            const conflicts = [];
            if (existing[0].email === email) {
                conflicts.push("email");
            }
            if (existing[0].username === username) {
                conflicts.push("username");
            }
            if (existing[0].phone === phone) {
                conflicts.push("phone");
            }

            return res.status(409).json({ error: `Účet s tímto ${conflicts.join(', ')} již existuje!` });
        }

        // Hashování hesla
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        // Uložení uživatele do databáze
        const [result] = await pool.query(
            'INSERT INTO users (username, email, phone, password_hash) VALUES (?, ?, ?, ?)',
            [username, email, phone, hashedPassword]
        );

        // Kontrola, zda byla registrace úspěšná
        if (result.affectedRows === 0) {
            return res.status(500).json({ error: "Registrace nebyla úspěšná!" });
        }

        res.status(201).json({ message: "Registrace proběhla úspěšně!" });
    } catch (err) {
        // Zpracování chyb
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

// Endpoint pro přihlášení uživatele
router.post('/login', [
    body('email').isEmail().withMessage('Email není platný!'),
    body('password').notEmpty().withMessage('Heslo není vyplněno!')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Všechna pole nejsou vyplněna!" });
        }

        const [result] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (result.length === 0) {
            return res.status(401).json({ error: "Chybné přihlašovací údaje!" });
        }

        const user = result[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: "Chybně zadané heslo!" });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: "Přihlášení proběhlo úspěšně!", token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

// Endpoint pro get uživatele podle id
router.post('/getById', async (req, res) => {
    try {
        const { user_id } = req.body;
        
        if (!user_id) {
            return res.status(400).json({ error: "Není vyplněno user_id!" });
        }

        const [result] = await pool.query('SELECT * FROM users WHERE id = ?', [user_id]);

        if (result.length === 0) {
            return res.status(404).json({ error: "Uživatel nenalezen!" });
        }

        res.json(result[0]);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

// Endpoint pro get všech uživatelů
router.get('/getAll', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM users');

        if (result.length === 0) {
            return res.status(404).json({ error: "Žádní uživatelé nenalezeni!" });
        }

        res.json(result);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
})

module.exports = router;