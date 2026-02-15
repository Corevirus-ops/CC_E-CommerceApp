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
    const newPass = await bcrypt.hash(pass, salt);
    if (newPass) return newPass
} catch (e) {
        console.log(e);
    }
    return;
}

router.post('/', checkValidCharacters, checkUserExists, async (req, res, next) => {
    try {
        const newPass = await cryptPass(req.pass);
            if (newPass) {
                await db.query(`BEGIN`);
                const user = await db.query(`INSERT INTO users (user_name, user_email) VALUES ($1, $2)`, [req.name, req.email]);
                const userInfo = await db.query(`SELECT * FROM users WHERE user_email = $1`, [req.email]);
                await db.query(`INSERT INTO pass VALUES ($1, $2)`, [userInfo.rows[0].user_id, newPass]); 
                await db.query(`COMMIT`);
            if (user.rowCount >= 1 ) {
               req.login(userInfo.rows[0], (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send();
                    } else {
                        return res.status(201).json({ok: true, message: 'Registration Successful!', user: {...userInfo.rows[0], loggedIn: true}});
                    }
                });

            }
                } 
    } catch (e) {
        console.log(e);
    }
    // res.status(500).send();
});



module.exports = router;