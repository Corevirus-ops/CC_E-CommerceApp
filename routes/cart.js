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


const getCartDetails = (req, res, next) => {
        const {cart_id} = req.params;
    const {product_id, quantity} = req.body;
    if (!cart_id || !product_id) {
        res.status(401).send()
        return
    }
    req.cart = cart_id;
    req.product = product_id;
    req.quantity = quantity;
    next();
};

const cartExists = async (req, res, next) => {
try {
    const cart = await db.query(`SELECT * FROM users_cart WHERE user_cart_id = $1`, [req.cart]);
    if (cart.rowCount) {
        next();
        return;
    };

} catch (e) {
    console.log(e);
}
res.status(404).send();
};

const productExists = async (req, res, next) => {
try {
     const productInTable = await db.query(`SELECT * FROM users_cart_items WHERE product_id = $1`, [req.product]);
     if (productInTable?.rowCount && req.method == 'POST') {
        res.status(400).send(`Item Already In Table`);
        return;
     }
    const product = await db.query(`SELECT * FROM products WHERE product_id = $1`, [req.product]);

    if (product?.rowCount) {
        next();
        return;
    };

} catch (e) {
    console.log(e);
}
res.status(404).send();
};


router.post('/:cart_id/addproduct', checkValidCharacters, getCartDetails, cartExists, productExists, async (req, res) => {
    try {    
const newProduct = await db.query(`INSERT INTO users_cart_items VALUES ($1, $2, $3)`, [req.product, req.quantity, req.cart]);
if (newProduct?.rowCount) {
    res.status(201).send(newProduct.rows);
    return;
} 
    } catch (e) {
        console.log(e);
    }
res.status(500).send();
});

router.put('/:cart_id/updateproduct', checkValidCharacters, getCartDetails, cartExists, productExists, async (req, res) => {
    try {    
const updateProduct = await db.query(`UPDATE users_cart_items SET quantity = $1 WHERE product_id = $2 AND user_cart_id = $3`, [req.quantity , req.product, req.cart]);
if (updateProduct?.rowCount) {
    res.status(200).send(updateProduct.rows);
    return
};
    } catch (e) {
        console.log(e);
    }
res.status(500).send();
});

router.delete('/:cart_id/removeproduct', checkValidCharacters, getCartDetails, cartExists, productExists, async (req, res) => {
    try {    
const deleteProduct = await db.query(`DELETE FROM users_cart_items WHERE product_id = $1 AND user_cart_id = $2`, [req.product, req.cart]);
       if (deleteProduct?.rowCount) {
        res.status(204).send();
       } else if (!deleteProduct?.rowCount) {
        res.status(404).send();
       }
    } catch (e) {
        console.log(e);
    }
res.status(500).send();
});

router.get('/:cart_id', async (req, res) => {
try {
    const {cart_id} = req.params;
    const cart = await db.query(`SELECT quantity, product_name, product_cost FROM users_cart_items, products WHERE users_cart_items.user_cart_id = $1 AND products.product_id = users_cart_items.product_id`, [cart_id]);
    if (cart?.rowCount) {
        res.send(cart.rows);
        return;
    } else if (!cart?.rowCount) {
        res.status(404).send();
        return;
    }

} catch (e) {
    console.log(e);
}
res.status(500).send();
});

module.exports = router;