const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');

const getUserByEmail = async (email) => {
    try {
        const user = await db.query(
            `SELECT * FROM users WHERE user_email = $1`,
            [email]
        );

        if (!user?.rows[0]) {
            return { user: null, pass: null };
        }

        const pass = await db.query(
            `SELECT pass FROM pass WHERE user_id = $1`,
            [user.rows[0].user_id]
        );

        return {
            user: user.rows[0],
            pass: pass?.rows[0]?.pass
        };
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
};

const getUserById = async (id) => {
    try {
        const user = await db.query(
            `SELECT * FROM users WHERE user_id = $1`,
            [id]
        );

        return user?.rows[0] || null;
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
};

const initialize = (passport) => {
    const authenticateUser = async (email, password, done) => {
        try {
            const { user, pass } = await getUserByEmail(email);

            if (!user) {
                return done(null, false, { message: 'No user with that email' });
            }

            if (!pass) {
                return done(null, false, { message: 'Password not set' });
            }

            const match = await bcrypt.compare(password, pass);

            if (!match) {
                return done(null, false, { message: 'Password incorrect' });
            }

            return done(null, user);
        } catch (err) {
            console.error('Authentication error:', err);
            return done(err);
        }
    };

    passport.use(
        new LocalStrategy(
            { usernameField: 'email' },
            authenticateUser
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    passport.deserializeUser(async (id, done) => { 
        try {
            const user = await getUserById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};

module.exports = { initialize };
