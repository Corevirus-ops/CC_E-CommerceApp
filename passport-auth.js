
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');

const getUserByEmail = async (email) => {
    try {
        const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const pass = await db.query(`SELECT pass FROM pass WHERE pass.user_id = users.user_id AND users.email = $1`, [email]);
        return {user: user?.rows[0], pass: pass?.rows[0]?.pass};
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
};

const getUserById = async (id) => {
    try {
        const user = await db.query(`SELECT * FROM users WHERE user_id = $1`, [id]);
        return {user: user?.rows[0]};
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
};


const initialize = (passport) => { 
    const authenticateUser = async (email, password, done) => { 
        try {
            const {user, pass} = await getUserByEmail(email); // Implement this function to fetch user by email from database
            if (!user) {
                return done(null, false, { message: 'No user with that email' });
            }  
            if (await bcrypt.compare(password, pass)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }   
        } catch (err) {
            return done(err);
        }
    }
passport.use(new LocalStrategy({
usernameField: 'email',
}, authenticateUser), 
passport.serializeUser((user, done) => done(null, user.user_id)),
passport.deserializeUser((id, done) => {
    return done(null, getUserById(id)); 
}));
}

module.exports = { initialize };
