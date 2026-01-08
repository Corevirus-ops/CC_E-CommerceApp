const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
console.log('creating new user');
res.send('We did a thing')
});

module.exports = router;