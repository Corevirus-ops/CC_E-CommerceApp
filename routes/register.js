const express = require('express');
const router = express.Router();
const db = require('../db/index');

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
    const {name, email} = req.body;
    req.name = name; 
    req.email = email;
    const data = await db.query(`SELECT * FROM users WHERE user_email = $1`, [email]);
    if (data.rowCount >= 1) {
        res.status(302).send('This Email Is Already Registered!');
    } else {
        next();
    }
}

router.post('/', checkValidCharacters, checkUserExists, async (req, res) => {
const data = await db.query(`INSERT INTO users (user_name, user_email) VALUES ($1, $2)`, [req.name, req.email]);
if (data) {
    res.status(201).send(data.rows);
} else {
    res.status(500).send();
}
});

module.exports = router;