if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const {initialize} = require('./passport-auth');
initialize(passport);


const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const registerRouter = require('./routes/register');
app.use('/register', registerRouter);

//const loginRouter = require('./routes/login');
app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

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