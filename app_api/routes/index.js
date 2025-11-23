// app_api/routes/index.js
const express = require('express');
const router = express.Router();

const races = require('../controllers/races');
//const users = require('../controllers/users');

// Health check endpoint
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'OddsMatch API is running' });
});

// Races
router.get('/races', races.raceList);
router.get('/races/:raceId', races.raceDetails);

// Users
//router.post('/users', users.userCreate);
//router.post('/users/login', users.userLogIn);

module.exports = router;
