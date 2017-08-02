/**
 * User routes module.
 * @module /routes/users
 */

const express = require('express');
const bodyParser = require('body-parser');
const {getUser, storeUser, getUsers} = require('../controllers/users');

// create application/json parser
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({extended: false});

const router = express.Router();

/**
 * Get all users.
 */
router.get('/', async (req, res) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

/**
 * Show a user.
 */
router.get('/:username', async (req, res) => {
    try {
        const user = await getUser(req.params.username);
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

/**
 * Create a new user.
 */
router.post('/', jsonParser, async (req, res) => {
    try {
        const newUser = await storeUser(req.body);
        return res.status(200).json(newUser);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;