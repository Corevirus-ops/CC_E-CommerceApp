const express = require('express');
const app = express();

require('dotenv').config();

const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

const registerRouter = require('./routes/register');
app.use('/register', registerRouter);

const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

app.listen(PORT, () => {
    console.log(`Listening On Port: ${PORT}`)
});