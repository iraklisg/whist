/**
 * User routes module.
 * @module /routes/users
 */

const express = require('express');
const getUser = require('../controllers/users');

const router = express.Router();

/**
 * Show user
 */
router.get('/:username', async (req, res, next) => {
    try {
        const result = await getUser(req.params.username);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

module.exports = router;