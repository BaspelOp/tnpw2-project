async function checkAdvertisementOwnership(req, res, next) {
    const [result ] = await pool.query(
        'SELECT user_id FROM advertisement WHERE id = ?',
        [req.body.advertisement_id]
    );
    
    if (result[0].user_id !== req.user.id) {
        return res.status(403).json({ error: "Nemáte oprávnění k této akci!" });
    }
    next();
}