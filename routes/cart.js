const express = require('express');
const router = express.Router();
const db = require('../db/index');
const checkValidCharacters = require('./validateChar');

const getUser = async (id) => {
    const user = await db.query(`SELECT * FROM users WHERE user_id = $1`, [id]);
    return user;
}

router.post('/', checkValidCharacters, async (req, res) => {
try {
    const {id} = req.body;
    if (!id) {
        res.status(401).send()
        return
    }
    const user = await getUser(id);
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
    try {
    const {id} = req.query;
    if (!id) {
        res.status(401).send()
        return
    }
    const user = await getUser(id);
    if (user.rowCount) {
        const carts = await db.query(`SELECT users_cart.*, users.user_name FROM users_cart, users WHERE users_cart.user_id = users.user_id AND users.user_id = $1`, [id]);
        if (carts.rowCount) {
            res.send(carts.rows);
            return
        }
    }

    } catch (e) {
        console.log(e)
    }
    res.status(500).send();
});

module.exports = router;