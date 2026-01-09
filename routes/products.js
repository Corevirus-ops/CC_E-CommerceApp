const express = require('express');
const router = express.Router();
const db = require('../db/index');

router.get('/', async (req, res) => {
    try {
        const category = req.query.category;
        let products;
        if (!category) {
            products = await db.query(`SELECT * FROM products`); 
        } else {
            products = await db.query(`SELECT products.*, category_name FROM products, category WHERE products.category_id = category.category_id AND category_name = $1`, [category]);
        }
       if (products?.rows[0]) {
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
        const category = req.query.category;
        let product;
        if (!category) {
            product = await db.query(`SELECT * FROM products WHERE product_id = $1`, [id]);
        } else if (category) {
            product = await db.query(`SELECT products.*, category_name FROM products, category WHERE products.category_id = category.category_id AND product_id = $1 AND category_name = $2`, [id, category]);
        }
        product?.rows[0] && res.send(product.rows) || res.status(404).send(`No Products Found`);

    } catch (e) {
        console.log(e)
        res.status(500).send();
    }
});




module.exports = router;