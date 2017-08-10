/**
 * Player service module.
 * @module /services/player
 */

const Player = require('../models/Player');
const Game = require('../models/Game');
const gamesService = require('../services/games');

const {makePlayersRepository} = require('../repositories/playersRepository'); // this is a factory

const playersRepository = makePlayersRepository();


const playerService = {

    /**
     * Returns all players
     * @returns {Promise}
     */
    getAllPlayers() {
        return playersRepository.getAll();
    },

    /**
     * Finds a player by nickname
     * @param {String} nickname
     * @returns {Promise}
     */
    getPlayerByNickname(nickname) {
        // exec() on find returns a Promise instead of the default callback
        return playersRepository.getByNickname(nickname);
    },

    /**
     * Saves a new player to database
     * @param {Object} data
     * @returns {Promise}
     */
    createPlayer(data) {
        return playersRepository.create(data);
    },

    /**P
     * Update an existing player
     * @param id
     * @param data
     * @returns {Promise}
     */
    updatePlayer(id, data) {
        return playersRepository.update(id, data)
    },

    /**
     * Find the highest final score achieved by the player
     */
    async getHighestScore(player) {
        // TODO get only the games for this player
        const games = await Game.find({})
            .populate('players.player')
            .exec();

        return await Promise.all(games.map(async (game) => {
            return await gamesService.getRanking(game.id); // SOS https://stackoverflow.com/questions/36992590/asynchronous-map-function-that-awaits-returns-promise-instead-of-value
        }));
    },

    /**
     * Find the highest score that a user has achieved so far
     * @param person
     */
    async highestScores(person) {
        try {
            const games = await Game.find({}).populate('players.player').exec();

            return games.reduce((acc, game) => {
                acc.push(game.players
                    .filter(player => player.player.id === person[0].id)
                    .reduce((acc, player) => {
                        acc = player.points;
                        return acc;
                    }, '')
                );
                return acc;
            }, []);

        } catch (err) {
            throw new Error(err);
        }
    }
};

module.exports = playerService;