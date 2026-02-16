let options;
const https = require('https');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();

const fs = require('fs');
options = {
  key: fs.readFileSync('cert.key'),
  cert: fs.readFileSync('cert.crt'),
};
}

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: true, 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 
  }
}));

const {initialize} = require('./passport-auth');
initialize(passport);

app.use(passport.initialize());
app.use(passport.session());


const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.status(403).json({ error: 'Already Authenticated!' });
    }
    next();
}
const registerRouter = require('./routes/register');
app.use('/register', checkNotAuthenticated, registerRouter);


//const loginRouter = require('./routes/login');

app.get('/failedlogin', (req, res) => {
    res.status(401).json({ message: 'Email or Password is Incorrect!' });
});
app.post('/login', passport.authenticate('local', { failureRedirect: '/failedlogin' }), (req, res) => {
    res.json({ message: 'Logged in successfully', user: {...req.user, loggedIn: true} });
});

app.get('/login/facebook', checkNotAuthenticated, passport.authenticate('facebook', { scope: ['email'] }));

app.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/failedlogin',
    successRedirect: process.env.CLIENT_URL
  }),
  (req, res) => res.json({ message: 'Logged in successfully', user: {...req.user, loggedIn: true} })
);


const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Not Authenticated!' });
}

app.get('/account', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not Authenticated!' });
    }
    const user = {
        ...req.user,
        loggedIn: true
    }
    res.json({ user });
});
app.delete('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout Failed!' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

const productRouter = require('./routes/products');
app.use('/products', checkAuthenticated, productRouter);

const userRouter = require('./routes/users');
app.use('/users', checkAuthenticated, userRouter);

const cartRouter = require('./routes/cart');
app.use('/cart', checkAuthenticated, cartRouter);

const orderRouter = require('./routes/order');
app.use('/order', checkAuthenticated, orderRouter);

const PORT = process.env.PORT || 3000;

const prefix = process.env.NODE_ENV === 'production' ? app : https.createServer(options, app);

prefix.listen(PORT, () => {
  console.log(`Listening On Port: ${PORT}`)
});
