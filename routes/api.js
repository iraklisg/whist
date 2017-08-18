/**
 * Player routes module.
 * @module /routes/players
 */

const express = require('express');
const bodyParser = require('body-parser');

const {getRankings} = require('../controllers/api');

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const router = express.Router();

/**
 * Get all player's rankings
 */
router.get('/players/:nickname/rankings', async (req, res) => {
    try {
        const rankings = await getRankings(req.params.nickname);
        return res.status(200).json(rankings);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;