const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;

app.use(bodyParser.json());

const registerRouter = require('./routes/register');
app.use('/register', registerRouter);

app.listen(PORT, () => {
    console.log(`Listening On Port: ${PORT}`)
});