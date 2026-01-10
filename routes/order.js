const express = require('express');
const router = express.Router();
const db = require('../db/index');

router.get('/', async (req, res) => {
try {
    const orders = await db.query(`
SELECT 
    o.order_id,
    o.order_date,
    o.user_id,
    o.is_delivered,
    STRING_AGG(
        CONCAT(p.product_name, ' (×', oi.amount, ')'),
        ', '
    ) AS order_contents,
    SUM(oi.amount) AS total_quantity
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.order_id
LEFT JOIN products p ON p.product_id = oi.product_id
GROUP BY o.order_id, o.order_date, o.user_id, o.is_delivered
ORDER BY o.order_date DESC`);
    if (orders?.rowCount) {
        res.send(orders.rows)
        return;
    } else if (!orders?.rowCount) {
        res.status(404).send();
        return
    }

} catch (e) {
    console.log(e);
    res.status(500).send(e);
}
res.status(500).send();
});

router.get('/:orderid', async (req, res) => {
try {
    const {orderid} = req.params;
    const orders = await db.query(`SELECT 
    o.order_id,
    o.order_date,
    o.user_id,
    o.is_delivered,
    STRING_AGG(
        CONCAT(p.product_name, ' (×', oi.amount, ')'),
        ', '
    ) AS order_contents,
    SUM(oi.amount) AS total_quantity
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.order_id
LEFT JOIN products p ON p.product_id = oi.product_id
WHERE o.order_id = $1
GROUP BY o.order_id, o.order_date, o.user_id, o.is_delivered
ORDER BY o.order_date DESC`, [orderid]);
    if (orders?.rowCount) {
        res.send(orders.rows)
        return;
    } else if (!orders?.rowCount) {
        res.status(404).send();
        return
    }

} catch (e) {
    console.log(e);
    res.status(500).send(e);
}
res.status(500).send();
});

module.exports = router;