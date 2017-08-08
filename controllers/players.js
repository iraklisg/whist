const _ = require('lodash');

const {getAllPlayers, getPlayerByNickname, savePlayer, updatePlayer, getHighestScore} = require('../services/players');


const playerController = {

    /**
     * Get all players from database
     * @returns {Promise.<*>}
     */
    async getPlayers() {
        // there is no await statement on the return statement,
        // because the return value of an async function
        // is implicitly wrapped in Promise.resolve.
        return getAllPlayers();
    },

    /**
     * Get a player by nickname from database
     * @param nickname
     * @returns {Promise.<*>}
     */
    async getPlayer(nickname) {
        if (nickname === '') throw new Error('Nickname cannot be blank');
        return getPlayerByNickname(nickname).then(player => getHighestScore(player));
    },

    /**
     * Save a new player to database
     * @param data
     * @returns {Promise.<*>}
     */
    async storePlayer(data) {
        // see https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
        if (_.isEmpty(data)) throw new Error('No data provided');
        return savePlayer(data);
    },

    /**
     * Update an existing player
     * @param id
     * @param data
     * @returns {Promise.<void>}
     */
    async putPlayer(id, data) {
        if (_.isEmpty(data)) throw new Error('No data provided');
        return updatePlayer(id, data);
    }
};

module.exports = playerController;