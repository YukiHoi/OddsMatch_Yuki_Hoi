const express = require('express');
const router = express.Router();

const ctrlLocations = require('../controllers/locations');
const ctrlOthers = require('../controllers/others');

// Home (uses locations.homelist)
router.get('/', ctrlLocations.homelist);

// Location
router.get('/login',    ctrlOthers.login);
router.post('/login',   ctrlOthers.doLogin);
router.get('/register', ctrlOthers.register);
router.post('/register',ctrlOthers.doRegister);

router.get('/logout',   ctrlOthers.logout);

router.get('/about',    ctrlOthers.about);

module.exports = router;