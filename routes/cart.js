const express = require('express');
const router = express.Router();
const db = require('../db/index');
const checkValidCharacters = require('./validateChar');

router.post('/', checkValidCharacters, async (req, res) => {
try {
    const {id} = req.body;
    if (!id) {
        res.status(401).send()
        return
    }
    const user = await db.query(`SELECT * FROM users WHERE user_id = $1`, [id]);
    if (user.rowCount) {
        const newCart = await db.query(`INSERT INTO users_cart (user_id) VALUES ($1)`, [id]);
        if (newCart?.rowCount) {
            res.status(201).send(newCart.rows);
            return;
        }
    }

} catch (e) {
    console.log(e);
}
res.status(500).send();
});

router.get('/', async (req, res) => {

});

module.exports = router;