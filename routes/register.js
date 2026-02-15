const express = require('express');
const router = express.Router();
const db = require('../db/index');
const bcrypt = require('bcrypt');
const checkValidCharacters = require('./validateChar');

const checkUserExists = async (req, res, next) => {
try {
    const {name, email, password} = req.body;
    const data = await db.query(`SELECT * FROM users WHERE user_email = $1`, [email]);
    if (data.rowCount >= 1) {
        res.status(409).json({ok: false, message: 'This Email Is Already Registered!'});
    } else {
    req.name = name; 
    req.email = email;
    req.pass = password;
        next();
    }
} catch (e) {
        console.log(e)
        res.status(500).send();
    }
};


const cryptPass = async (pass) => {
try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass, salt);
} catch (e) {
        console.log(e);
    }
    return;
}

router.post('/', checkValidCharacters, checkUserExists, async (req, res) => {
    try {
        const newPass = await cryptPass(req.pass);

        if (!newPass) {
            return res.status(500).json({ ok: false, message: 'Registration Failed!' });
        }

        await db.query('BEGIN');

        const user = await db.query(
            `INSERT INTO users (user_name, user_email)
             VALUES ($1, $2)
             RETURNING *`,
            [req.name, req.email]
        );

        const userInfo = user.rows[0];

        await db.query(
            `INSERT INTO pass (user_id, pass)
             VALUES ($1, $2)`,
            [userInfo.user_id, newPass]
        );

        await db.query('COMMIT');

        req.logIn(userInfo, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ ok: false, message: 'Registration Failed!' });
            }
            res.status(201).json({ ok: true, message: 'Registered Successfully!', user: {...userInfo, loggedIn: true} });
        });

        console.log(req.isAuthenticated());

    } catch (e) {
        console.log(e);
        await db.query('ROLLBACK');
        return res.status(500).json({ ok: false, message: 'Registration Failed!' });
    }
});




module.exports = router;