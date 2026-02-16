const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');
const db = require('./db');

const getUserByEmail = async (email) => {
    try {
        const user = await db.query(
            `SELECT u.*, p.pass
            FROM users u
            JOIN pass p ON u.user_id = p.user_id
            WHERE u.user_email = $1`,
            [email]
        );


        if (!user?.rows[0]) {
            return { user: null, pass: null };
        }

        return {
            user: user.rows[0]
        };
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
};



const initialize = (passport) => {
    const authenticateUser = async (email, password, done) => {
        try {
            const { user} = await getUserByEmail(email);

            if (!user || user.length === 0) {
                return done(null, false, { message: 'No user with that email' });
            }

            if (!user.pass) {
                return done(null, false, { message: 'Password not set' });
            }

            const match = await bcrypt.compare(password, user.pass);
            if (!match) {
                return done(null, false, { message: 'Password incorrect' });
            }
            
            return done(null, {...user, pass: undefined});
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

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.CLIENT_CALLBACK_URL}`,
    profileFields: ['id', 'displayName', 'emails'],
    
    enableProof: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(null, false, { message: 'Email is required from Facebook' });
      }
      
    const userData = await db.query(
        `SELECT *
        FROM users
        WHERE user_email = $1`,
        [email]
    );
    let user = userData.rows[0];

       
      
      if (!user) {
        const newUser = await db.query(
          `INSERT INTO users (user_name, user_email) VALUES ($1, $2) RETURNING *`,
          [profile.displayName, email]
        );
        user = newUser.rows[0];
      }
      
      return done(null, user);
    } catch (err) {
      console.error('Facebook authentication error:', err);
      return done(err);
    }
  }
));

    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    passport.deserializeUser(async (id, done) => { 
        try {
            const user = await getUserById(id);
            if (!user) {
                return done(null, false);
            }
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};

module.exports = { initialize };
