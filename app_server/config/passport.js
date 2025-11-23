// app_server/config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Account = require('../models/account');

// Local strategy: login with email + password
passport.use(
  new LocalStrategy(
    { usernameField: 'email' }, // use "email" instead of default "username"
    async (email, password, done) => {
      try {
        const user = await Account.findOne({ email: email.toLowerCase() });
        if (!user) {
          return done(null, false, { message: 'Invalid email or password.' });
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
          return done(null, false, { message: 'Invalid email or password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// how we store user in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// how we get user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Account.findById(id).lean();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
