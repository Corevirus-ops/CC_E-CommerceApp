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

router.post('/:cart_id/addproduct', async (req, res) => {
    try {
        const {cart_id} = req.params;
    const {product_id} = req.query;
    if (!cart_id || !product_id) {
        res.status(401).send()
        return
    }
    const cart = await db.query(`SELECT * FROM users_cart WHERE user_cart_id = $1`, [cart_id]);
    if (cart.rowCount) {
        const hasProduct = await db.query(`SELECT users_cart_items.*, product_name FROM users_cart_items, products WHERE users_cart_items.product_id = products.product_id AND products.product_id = $1`, [product_id]);
        if (hasProduct.rowCount) {
            res.send(hasProduct.rows);
        }
        return;
    }
    } catch (e) {
        console.log(e);
    }
res.status(500).send();
});

module.exports = router;