/**
 * User routes module.
 * @module /routes/users
 */

const express = require('express');
const seedUsers = require('../seeds/users');

const router = express.Router();

/**
 * Show user
 */
router.get('/users', async (req, res, next) => {
    try {
        const result = await seedUsers();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

module.exports = router;