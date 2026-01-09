const express = require('express');
const router = express.Router();
const db = require('../db/index');
const checkValidCharacters = require('./validateChar');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        const users = await db.query(`SELECT user_name, user_email FROM users`);
        users?.rows[0] && res.send(users.rows) || res.status(404).send(`Found No Users`);

    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const users = await db.query(`SELECT user_name, user_email FROM users WHERE user_id = $1`, [id]);
        users?.rows[0] && res.send(users.rows) || res.status(404).send(`Found No Users`);

    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});

router.put('/:id', checkValidCharacters, async (req, res) => {
try {
    const {id} = req.params;
    const user = await db.query(`SELECT * FROM users WHERE user_id = $1`, [id]);
    if (user.rowCount == 0) {
        res.status(404).send();
        return;
    }; 
    const {username, email, pass} = req.body;
    let updatedUser;
    let updatedPass;
    if (username || email) {
        updatedUser = await db.query(`UPDATE users SET user_name = $1, user_email = $2 WHERE user_id = $3`, [username || user?.rows[0].user_name, email || user?.rows[0].user_email, id]);
    };
    if (pass) {
            const salt = await bcrypt.genSalt(10);
            const newPass = await bcrypt.hash(pass, salt);
            updatedPass = await db.query(`UPDATE pass SET pass = $1 WHERE user_id = $2`, [newPass, id]);
    }
    if (updatedUser?.rowCount >= 1 && updatedPass?.rowCount >= 1) { 
            res.status(200).send(updatedUser.rows) 
            return
        } else if (updatedUser?.rowCount >= 1) {
            res.status(200).send(updatedUser.rows)
            return
        } else if (updatedPass?.rowCount >= 1) {
            res.status(200).send(`Updated Password Successfully`)
            return
        }

res.status(500).send();
} catch (e) {
    console.log(e);
    res.status(500).send();
}
});

module.exports = router;