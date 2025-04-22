const express = require('express');
const router = express.Router();
const { pool } = require('../database');
const authenticateToken = require('../middleware/authenticateToken');
const checkAdvertisementOwnership = require('../middleware/checkOwnership');

// Pro validaci příchozích dat
const { body, validationResult } = require('express-validator');

// Pro uložení obrázků
const multer = require('multer');
const fs = require('fs');

// Multer konfigurace pro uložení obrázků
const storage = multer.diskStorage({
    destination: async function (req, _, cb) {
        const user_id = req.user.id;
        const advertisement_id = req.body.advertisement_id || 'temp';
        const dir = `images/${user_id}/${advertisement_id}`;
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (_, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Endpoint pro vytvoření inzerátu
router.post('/create', authenticateToken, [
    body('category_id').notEmpty().withMessage('Není vyplněna kategorie!'),
    body('title').notEmpty().withMessage('Není vyplněn název!'),
    body('description').notEmpty().withMessage('Přidej nějaký popisek!'),
    body('price').notEmpty().isFloat({ min: 0}).withMessage('Není vyplněna cena, nesmí být záporná!'),
    body('location').notEmpty().withMessage('Není vyplněno místo prodeje!'),
], upload.array('images', 10), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {    
            return res.status(400).json({ errors: errors.array() });
        }

        const { category_id, title, description, price, location } = req.body;
        const user_id = req.user.id;

        if (!user_id || !category_id || !title || !description || !price || !location) {
            return res.status(400).json({ error: "Všechna pole nejsou vyplněna!" });
        };

        const [result] = await pool.query(
            'INSERT INTO advertisement (user_id, category_id, title, description, price, location) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, category_id, title, description, price, location]
        )

        if (result.affectedRows === 0) {
            return res.status(500).json({ error: "Vytvoření inzerátu se nezdařilo!" });
        }

        const advertisement_id = result.insertId;

        const imagePaths = [];
        for (const file of req.files) {
            const oldPath = file.path;
            const newDir = `images/${user_id}/${advertisement_id}`;
            const newPath = `${newDir}/${file.filename}`;

            fs.mkdirSync(newDir, { recursive: true });
            fs.renameSync(oldPath, newPath);

            await pool.query(
                'INSERT INTO image (advertisement_id, image_url) VALUES (?, ?)',
                [advertisement_id, `${newPath}`]
            )
            imagePaths.push(`${newPath}`);
        }

        if (imagePaths.length === 0) {
            return res.status(500).json({ error: "Nahrání obrázků se nezdařilo!" });
        }

        res.status(201).json({ message: "Inzerát byl úspěšně vytvořen!" });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

// Endpoint pro get inzerátů podle user id
router.post('/getById', async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "Není vyplněno user_id!" });
        }

        const [result] = await pool.query(`
            SELECT
                a.id,
                a.title,
                a.description,
                a.price,
                a.location,
                a.status,
                a.created_at,
                c.id AS category_id,
                c.name AS category_name,
                GROUP_CONCAT(i.image_url) AS images
            FROM advertisement a
            LEFT JOIN category c ON a.category_id = c.id
            LEFT JOIN image i ON a.id = i.advertisement_id
            WHERE a.user_id = ?
            GROUP BY a.id
        `, [user_id]);

        const advertisements = result.map(advertisement => ({
            ...advertisement,
            images: advertisement.images ? advertisement.images.split(',') : []
        }));

        res.json(advertisements);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

// Endpoint pro get všech inzerátů
router.get('/getAll', async (_, res) => {
    try {
        const [result] = await pool.query(`
            SELECT
                a.id,
                a.title,
                a.description,
                a.price,
                a.location,
                a.status,
                a.created_at,
                u.id AS user_id,
                u.username,
                c.id AS category_id,
                c.name AS category_name,
                GROUP_CONCAT(i.image_url) AS images
            FROM advertisement a
            JOIN users u ON a.user_id = u.id
            LEFT JOIN category c ON a.category_id = c.id
            LEFT JOIN image i ON a.id = i.advertisement_id
            GROUP BY a.id
        `);

        if (result.length === 0) {
            return res.status(404).json({ error: "Žádné inzeráty nenalezeny!" });
        }

        const advertisements = result.map(advertisement => ({
            ...advertisement,
            images: advertisement.images ? advertisement.images.split(',') : []
        }));

        res.json(advertisements);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

// Endpoint pro smazáni inzerátu
router.post('/delete', authenticateToken, checkAdvertisementOwnership, async (req, res) => {
    try {
        const { advertisement_id } = req.body;

        if (!advertisement_id) {
            return res.status(400).json({ error: "Není vyplněno advertisement_id!" });
        }

        const [result] = await pool.query(
            'DELETE FROM advertisement WHERE id = ?',
            [advertisement_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Inzerát nenalezen!" });
        }

        res.json({ message: "Inzerát byl úspěšně smazán!" });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: "Error" });
    }
});

module.exports = router;