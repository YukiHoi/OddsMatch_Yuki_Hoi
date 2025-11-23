const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
  console.error('MongoDB connection string is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

require('./locations');
require('./others');
require('../../app_server/models/account');

console.log('Models registered:', mongoose.modelNames());
module.exports = mongoose;