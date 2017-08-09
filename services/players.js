/**
 * Player service module.
 * @module /services/player
 */

const Player = require('../models/Player');
const Game = require('../models/Game');
const gamesService = require('../services/games');

const playerService = {

    /**
     * Returns all players
     * @returns {Promise}
     */
    getAllPlayers() {
        return Player.find().exec();
    },

    /**
     * Finds a player by nickname
     * @param {String} nickname
     * @returns {Promise}
     */
    getPlayerByNickname(nickname) {
        // exec() on find returns a Promise instead of the default callback
        return Player.find({nickname}).exec();
    },

    /**
     * Saves a new player to database
     * @param {Object} data
     * @returns {Promise} - Either fulfilled with new player or rejected with error
     */
    savePlayer(data) {
        return Player({nickname: data.nickname}).save();
    },

    /**
     * Update an existing player
     * @param id
     * @param data
     * @returns {Promise}
     */
    updatePlayer(id, data) {
        return Player.findOneAndUpdate(id, {$set: data}, {new: true}).exec();  // ╯°□°）╯︵ ┻━┻
        // https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
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