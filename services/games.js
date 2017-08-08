/**
 * Game service module.
 * @module /services/games
 */

const Game = require('../models/Game');

const gameService = {

    /**
     * Returns all games
     * @returns {Promise}
     */
    getAllGames() {
        return Game.find().exec();
    },

    /**
     * Finds a game by id
     * @param {String} id
     * @returns {Promise}
     */
    getGameById(id) {
        // exec() on find returns a Promise instead of the default callback
        return Game.findOne({_id: id}).exec(); // possible bug on findById https://github.com/Automattic/mongoose/issues/4867
    },

    /**
     * Saves a new game to database
     * @param {Object} data
     * @returns {Promise} - Either fulfilled with new game or rejected with error
     */
    saveGame(data) {
        return Game({id: data.id}).save();
    },

    /**
     * Update an existing game
     * @param id
     * @param data
     * @returns {Promise}
     */
    updateGame(id, data) {
        return Game.findOneAndUpdate(id, {$set: data}, {new: true}).exec();
    },

    /**
     * Get the final ranking for a game.
     * @param {String} id - The game id
     * @returns {Promise<Array>} // Because is an async function ;-)
     */
    async getRanking(id) {
        try {
            const game = await Game.findOne({_id: id})
                .populate('players.player')
                .exec(); // returns a promise, so I await

            return game.players.map(info => {
                return {
                    player: info.player.nickname,
                    final: Number(info.points.slice(-1)),
                }
            });
        } catch (err) {
            throw new Error(err);
        }

    }
};

module.exports = gameService;