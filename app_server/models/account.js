// app_server/models/account.js
const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  phoneNo:    { type: String, required: true },
  address:    { type: String, required: true },

  // hashed password (bcrypt)
  passwordHash: { type: String, required: true }
});

module.exports = mongoose.model('Account', AccountSchema);
