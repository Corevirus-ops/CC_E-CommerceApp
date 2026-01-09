const express = require('express');
const router = express.Router();
const db = require('../db/index');
const bcrypt = require('bcrypt');

const checkValidCharacters = (req, res, next) => {
  const allowedCharsRegex = /^[a-zA-Z0-9\s.,!?-@]+$/; 

  // Iterate over all body properties and check against the regex
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      if (!allowedCharsRegex.test(req.body[key])) {
        return res.status(400).json({ // Return Bad Request if invalid character found
          msg: `Invalid characters found in field: ${key}. Only alphanumeric, spaces, and basic punctuation are allowed.`
        });
      }
    }
  }

  // If all checks pass, pass control to the next handler
  next();
};

const checkUserExists = async (req, res, next) => {
    const {name, email, password} = req.body;
    req.name = name; 
    req.email = email;
    req.pass = password;
    const data = await db.query(`SELECT * FROM users WHERE user_email = $1`, [email]);
    if (data.rowCount >= 1) {
        res.status(302).send('This Email Is Already Registered!');
    } else {
        next();
    }
};

//create encrypted password with salt
const cryptPass = async (pass) => {
const salt = await bcrypt.genSalt(10);
const newPass = await bcrypt.hash(pass, salt);
if (newPass) {
    return newPass
} else return;
}

router.post('/', checkValidCharacters, checkUserExists, async (req, res) => {
const newPass = await cryptPass(req.pass);
if (newPass) {
    const user = await db.query(`INSERT INTO users (user_name, user_email) VALUES ($1, $2)`, [req.name, req.email]);
    const userInfo = await db.query(`SELECT * FROM users WHERE user_email = $1`, [req.email]);
    const pass = await db.query(`INSERT INTO pass VALUES ($1, $2)`, [userInfo.rows[0].user_id, newPass]); 
    if (user && pass) {
    res.status(201).send(user);
} else {
    res.status(500).send();
}
} else {
    res.status(500).send();
}
});

module.exports = router;