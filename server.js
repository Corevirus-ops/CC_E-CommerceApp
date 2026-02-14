if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));


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

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.status(403).send('Already Authenticated!').redirect('/');
    }
    next();
}
const registerRouter = require('./routes/register');
app.use('/register', checkNotAuthenticated, registerRouter, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}));


//const loginRouter = require('./routes/login');
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Not Authenticated!').redirect('/login');
}

app.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut();
    res.redirect('/login');
});
const productRouter = require('./routes/products');
app.use('/products', checkAuthenticated, productRouter);

const userRouter = require('./routes/users');
app.use('/users', checkAuthenticated, userRouter);

const cartRouter = require('./routes/cart');
app.use('/cart', checkAuthenticated, cartRouter);

const orderRouter = require('./routes/order');
app.use('/order', checkAuthenticated, orderRouter);

app.listen(PORT, () => {
    console.log(`Listening On Port: ${PORT}`)
});
