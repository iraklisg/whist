/**
 * Player routes module.
 * @module /routes/players
 */

const express = require('express');
const bodyParser = require('body-parser');

const {getPlayers, getPlayer, storePlayer, putPlayer} = require('../controllers/players');

// create application/json parser
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({extended: false});

const router = express.Router();

/**
 * Get all players
 */
router.get('/', async (req, res) => {
    try {
        const players = await getPlayers();
        return res.render('players/index', {players: players});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

/**
 * Get a player by nickname
 */
router.get('/:nickname', async (req, res) => {
    try {
        const player = await getPlayer(req.params.nickname);
        return res.status(200).json(player);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

/**
 * Create a new player
 */
router.post('/', jsonParser, async (req, res) => {
    try {
        const newPlayer = await storePlayer(req.body);
        return res.status(200).json(newPlayer);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

/**
 * Update a player
 */
router.put('/:id', jsonParser, async (req, res) => {
    try {
        const updatedPlayer = await putPlayer(req.params.id, req.body);
        return res.status(200).json(updatedPlayer);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;