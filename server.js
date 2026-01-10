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

const productRouter = require('./routes/products');
app.use('/products', productRouter);

const userRouter = require('./routes/users');
app.use('/users', userRouter);

const cartRouter = require('./routes/cart');
app.use('/cart', cartRouter);

const orderRouter = require('./routes/order');
app.use('/order', orderRouter);

app.listen(PORT, () => {
    console.log(`Listening On Port: ${PORT}`)
});