const express = require('express');
const router = express.Router();
const db = require('../db/index');

router.get('/', async (req, res) => {
    try {
       const products = await db.query(`SELECT * FROM products`); 
       if (products.rows[0]) {
        res.send(products.rows);
    } else res.status(404).send(`No Products Found`)
    } catch (e) {
        console.log(e)
        res.status(500).send();
    }

});

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const product = await db.query(`SELECT * FROM products WHERE product_id = $1`, [id]);
        product.rows[0] && res.send(product.rows) || res.status(404).send(`No Products Found`);

    } catch (e) {
        console.log(e)
        res.status(500).send();
    }
})

module.exports = router;