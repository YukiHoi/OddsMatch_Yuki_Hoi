// app_server/routes/index.js
const express  = require('express');
const router   = express.Router();
const passport = require('passport');
const bcrypt   = require('bcryptjs');

const ctrlLocations = require('../controllers/locations');
const ctrlOthers    = require('../controllers/others');
const Account       = require('../models/account');

// Home – uses your existing locations controller
router.get('/', ctrlLocations.homelist);

// ===== REGISTER =====

router.get('/register', ctrlOthers.register);

router.post('/register', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNo,
    address,
    password,
    confirm
  } = req.body;

  const formData = { firstName, lastName, email, phoneNo, address };

  // validation
  if (!firstName || !lastName || !email || !phoneNo || !address || !password || !confirm) {
    return res.render('register', {
      title: 'Register',
      error: 'All fields are required.',
      formData
    });
  }

  if (password !== confirm) {
    return res.render('register', {
      title: 'Register',
      error: 'Passwords do not match.',
      formData
    });
  }

  try {
    // existing email?
    const existing = await Account.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.render('register', {
        title: 'Register',
        error: 'Email is already registered.',
        formData
      });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const account = new Account({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phoneNo,
      address,
      passwordHash
    });

    await account.save();

    // auto-login after register
    req.logIn(account, err => {
      if (err) {
        console.error('req.logIn after register error:', err);
        return res.redirect('/login');
      }
      return res.redirect('/');
    });

  } catch (err) {
    console.error('Registration error:', err);
    return res.render('register', {
      title: 'Register',
      error: 'Error creating account. Please try again.',
      formData
    });
  }
});

// ===== LOGIN =====

router.get('/login', ctrlOthers.login);

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const message = (info && info.message) || 'Invalid email or password.';
      return res.render('login', {
        title: 'Login',
        error: message,
        success: null
      });
    }

    req.logIn(user, err2 => {
      if (err2) {
        return next(err2);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

// ===== LOGOUT =====

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);

    req.session.save(err2 => {
      if (err2) return next(err2);
      res.redirect('/login');
    });
  });
});

// About page if you use it
router.get('/about', ctrlOthers.about);

module.exports = router;
