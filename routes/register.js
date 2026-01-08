const express = require('express');
const router = express.Router();
const db = require('../db/index');

router.post('/', async (req, res) => {
const {name, email} = req.query;
const data = await db.query(`INSERT INTO users (user_name, user_email) VALUES ($1, $2)`, [name, email]);
if (data) {
    console.log(data);
    res.status(201).send(data.rows);
} else {
    res.status(500).send();
}
});

module.exports = router;