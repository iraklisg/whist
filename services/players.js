/**
 * Player service module.
 * @module /services/player
 */

const Player = require('../models/Player');

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
    }
};

module.exports = playerService;