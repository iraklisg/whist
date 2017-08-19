/**
 * Game routes module.
 * @module /routes/games
 */

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const {getGames, getGame, storeGame, putGame} = require('../controllers/games');
const {getPlayers} = require('../controllers/players');
let upload = multer();

// create application/json parser
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({extended: false});

const router = express.Router();

/**
 * Get all games
 */
router.get('/', async (req, res) => {
    try {
        const games = await getGames();
        return res.render('games/index', {games: games});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

/**
 * Go to page to create a new game
 */
router.get('/add', async (req, res) => {
    try {
        const players = await getPlayers();
        return res.render('games/add', {players: players});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

/**
 * Handle form submission (creation of new game)
 */
router.post('/add', async (req, res) => {
    try {
        console.log(req.file);
        console.log(req.body);
        // const newGame = await storeGame(req.body);
        const games = await getGames();
        return res.render('games/add', {games: games});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

/**
  * Get a game by id
 */
router.get('/:id', async (req, res) => {
    try {
        const game = await getGame(req.params.id);
        return res.status(200).json(game);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

/**
 * Update a game
 */
router.put('/:id', jsonParser, async (res, req) => {
    const id = req.params.id,
          data = req.body;

    try {
        const updatedGame = await putGame(id, data);
        return res.status(200).json(updatedGame);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;