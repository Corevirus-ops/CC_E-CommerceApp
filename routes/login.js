const express = require('express');
const router = express.Router();
const db = require('../db/index');
const bcrypt = require('bcrypt');
const checkValidCharacters = require('./validateChar');

router.post('/', checkValidCharacters, async (req, res) => {
try {
        const {email, pass} = req.body;
        const userExists = await db.query(`SELECT COUNT(*) FROM users WHERE user_email = $1`, [email]);
        if (userExists.rows[0].count != '0') {
            const toVerify = await db.query(`SELECT pass.pass, users.user_name FROM pass, users WHERE users.user_id = pass.user_id AND users.user_email = $1`, [email]);
            const verified = await bcrypt.compare(pass, toVerify.rows[0].pass);
            if (verified) {
                res.status(302).send(`Welcome Back ${toVerify.rows[0].user_name}`);
                return;
            }
        }
} catch (e) {
    console.log(e)
    res.status(500).send();
    }



res.status(401).send('Incorrect Credentials');
});

module.exports = router;