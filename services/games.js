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
        return Game.find({id}).exec();
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
    updatePlayer(id, data) {
        return Game.findOneAndUpdate(id, {$set: data}, {new: true}).exec();  // ╯°□°）╯︵ ┻━┻
        // https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
    }
};

module.exports = gameService;