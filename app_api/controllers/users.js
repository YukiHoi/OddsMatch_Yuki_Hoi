// app_api/controllers/users.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // password hashing
const User = mongoose.model('User');

// POST /api/users
// create new user storage with hashed password and return user ID
const userCreate = async (req, res) => {
  console.log('[POST /api/users] Creating new user...');
  try {
    const { firstName, lastName, email, phoneNo, address, password } = req.body || {};
    
    // Check for missing fields
    if (!firstName || !lastName || !email || !phoneNo || !address || !password) {
      return res.status(400).json({ 
        message: 'All fields are required',
        success: false
      });
    }

    // Check password length
    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long',
        success: false
      });
    }

    // Hash the password (make it secure)
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Try to create the user
    console.log('Creating user in database...');
    const user = await User.create({ 
      firstName, 
      lastName, 
      email: email.toLowerCase(), // store email in lowercase
      phoneNo, 
      address, 
      passwordHash 
    });

    console.log('User created successfully:', user._id);
    res.status(201).json({ 
      message: 'Registration successful! Please log in.',
      success: true,
      user: { _id: user._id }
    });

  } catch (err) {
    console.error('[userCreate] Error:', err.message);

    // Handle specific errors
    if (err.code === 11000) {
      return res.status(409).json({ 
        message: 'This email is already registered. Please use a different email.',
        success: false
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: messages[0], // Send first error message
        success: false
      });
    }

    // Handle other errors
    res.status(500).json({ 
      message: 'Sorry, something went wrong. Please try again.',
      success: false
    });
  }
};
// fetch user and verify password
const userLogIn = async (req, res) => {
  console.log('[POST /api/users/login] body:', req.body);
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ 
      message: 'Login successful', 
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('[userLogIn]', err);
    res.status(500).send('Login failed');
  }
};
module.exports = {userCreate,userLogIn
};