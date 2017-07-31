const express = require('express');
const userControllers = require('./controllers/users');

const router = express.Router();

router.get('/users/:username', userControllers);

module.exports = router;